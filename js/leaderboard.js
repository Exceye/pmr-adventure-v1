/*
 * PMR Adventure - Leaderboard module
 *
 * Saat ini memakai localStorage agar langsung berjalan tanpa server.
 * Untuk leaderboard online lintas perangkat, isi API_URL dengan endpoint backend
 * (misalnya Firebase/Cloud Functions atau server milik sendiri), lalu sesuaikan
 * fungsi getTopScores() dan submitScore() dengan format API tersebut.
 */

const STORAGE_KEY = "pmrAdventureLeaderboard";
const API_URL = ""; // Kosong = mode lokal. Isi URL endpoint saat backend siap.

function readLocalScores() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeLocalScores(scores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

export async function getTopScores(limit = 5) {
  if (API_URL) {
    const response = await fetch(`${API_URL}/leaderboard?limit=${limit}`);
    if (!response.ok) throw new Error("Gagal mengambil leaderboard.");
    return response.json();
  }

  return readLocalScores()
    .sort((a, b) => Number(b.score) - Number(a.score))
    .slice(0, limit);
}

export async function submitScore({ name, score }) {
  const cleanName = String(name || "").trim().slice(0, 14);
  const cleanScore = Math.max(0, Math.floor(Number(score) || 0));
  if (!cleanName) throw new Error("Nama pemain tidak valid.");

  if (API_URL) {
    const response = await fetch(`${API_URL}/leaderboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cleanName, score: cleanScore })
    });
    if (!response.ok) throw new Error("Gagal mengirim skor.");
    return response.json();
  }

  const scores = readLocalScores();
  const existing = scores.findIndex(
    item => String(item.name).toLowerCase() === cleanName.toLowerCase()
  );

  if (existing >= 0) {
    scores[existing].score = Math.max(Number(scores[existing].score) || 0, cleanScore);
  } else {
    scores.push({ name: cleanName, score: cleanScore });
  }

  scores.sort((a, b) => Number(b.score) - Number(a.score));
  writeLocalScores(scores.slice(0, 100));
  return getTopScores(100);
}

export async function showLeaderboard($) {
  const panel = $("lbp");
  const list = $("lbl");
  panel.style.display = "flex";
  list.textContent = "Memuat leaderboard...";

  try {
    const scores = await getTopScores(5);
    list.innerHTML = "";

    for (let i = 0; i < 5; i++) {
      const item = scores[i];
      const row = document.createElement("div");
      row.className = "lr";

      const rank = document.createElement("span");
      rank.textContent = String(i + 1);

      const player = document.createElement("span");
      player.textContent = item ? item.name : "—";

      const points = document.createElement("span");
      points.textContent = `${item ? Number(item.score) || 0 : 0} poin`;

      row.append(rank, player, points);
      list.appendChild(row);
    }
  } catch (error) {
    list.textContent = error.message || "Leaderboard tidak dapat dimuat.";
  }
}
