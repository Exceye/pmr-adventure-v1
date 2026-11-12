/*
 * PMR Adventure - Leaderboard module
 *
 * Memakai Firebase Firestore (koleksi "leaderboard", 1 dokumen per pemain,
 * menyimpan skor terbaik). Jika js/firebase-config.js belum diisi, otomatis
 * memakai localStorage sebagai cadangan sehingga game tetap bisa dicoba.
 */
import { firebaseConfig } from "./firebase-config.js";

const FB_VERSION = "10.14.1";
const COLLECTION = "leaderboard";
const STORAGE_KEY = "pmrAdventureLeaderboard";
const MAX_NAME = 14;

export const isOnline = !String(firebaseConfig.apiKey || "").startsWith("ISI_");

/* ---------- Firebase (dimuat hanya saat dipakai) ---------- */
let fbPromise = null;
function getFirebase() {
  if (!fbPromise) {
    fbPromise = (async () => {
      const base = `https://www.gstatic.com/firebasejs/${FB_VERSION}`;
      const [{ initializeApp }, fs] = await Promise.all([
        import(`${base}/firebase-app.js`),
        import(`${base}/firebase-firestore.js`)
      ]);
      const db = fs.getFirestore(initializeApp(firebaseConfig));
      return { db, ...fs };
    })();
    fbPromise.catch(() => { fbPromise = null; }); // boleh dicoba ulang
  }
  return fbPromise;
}

// ID dokumen dari nama: "Budi" dan "budi" dianggap pemain yang sama.
function playerId(name) {
  return "p_" + encodeURIComponent(name.toLowerCase()).replace(/\./g, "%2E");
}

function cleanInput(name, score) {
  const cleanName = String(name || "").trim().slice(0, MAX_NAME);
  const cleanScore = Math.min(90, Math.max(0, Math.floor(Number(score) || 0)));
  if (!cleanName) throw new Error("Nama pemain tidak valid.");
  return { cleanName, cleanScore };
}

/* ---------- localStorage (cadangan) ---------- */
function readLocalScores() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
function writeLocalScores(scores) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(scores)); } catch {}
}

/* ---------- API publik ---------- */
export async function getTopScores(limit = 5) {
  if (isOnline) {
    const { db, collection, query, orderBy, limit: lim, getDocs } = await getFirebase();
    const q = query(collection(db, COLLECTION), orderBy("score", "desc"), lim(limit));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ name: d.data().name, score: d.data().score }));
  }
  return readLocalScores()
    .sort((a, b) => Number(b.score) - Number(a.score))
    .slice(0, limit);
}

/**
 * Simpan skor. Hanya menimpa jika skor baru lebih tinggi dari skor lama pemain.
 * Mengembalikan { saved: boolean, best: number }.
 */
export async function submitScore({ name, score }) {
  const { cleanName, cleanScore } = cleanInput(name, score);

  if (isOnline) {
    const { db, doc, getDoc, setDoc, serverTimestamp } = await getFirebase();
    const ref = doc(db, COLLECTION, playerId(cleanName));
    const old = await getDoc(ref);
    const oldScore = old.exists() ? Number(old.data().score) || 0 : -1;
    if (cleanScore <= oldScore) return { saved: false, best: oldScore };
    await setDoc(ref, { name: cleanName, score: cleanScore, updatedAt: serverTimestamp() });
    return { saved: true, best: cleanScore };
  }

  const scores = readLocalScores();
  const i = scores.findIndex(s => String(s.name).toLowerCase() === cleanName.toLowerCase());
  let saved = true, best = cleanScore;
  if (i >= 0) {
    best = Math.max(Number(scores[i].score) || 0, cleanScore);
    saved = cleanScore > (Number(scores[i].score) || 0);
    scores[i].score = best;
  } else {
    scores.push({ name: cleanName, score: cleanScore });
  }
  scores.sort((a, b) => Number(b.score) - Number(a.score));
  writeLocalScores(scores.slice(0, 100));
  return { saved, best };
}

export async function showLeaderboard($) {
  const panel = $("lbp");
  const list = $("lbl");
  const note = $("lbn");
  panel.style.display = "flex";
  list.textContent = "Memuat leaderboard...";
  if (note) {
    note.textContent = isOnline
      ? ""
      : "Mode lokal: skor hanya tersimpan di perangkat ini (Firebase belum dikonfigurasi).";
  }

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
    console.error(error);
    list.textContent = "Leaderboard tidak dapat dimuat. Periksa koneksi internet.";
  }
}
