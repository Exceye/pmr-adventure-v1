# PMR Adventure

## Struktur
- `index.html` — halaman utama dan elemen UI.
- `css/style.css` — seluruh tampilan.
- `js/game.js` — logika game, karakter, map, kontrol, dialog, dan perpindahan ruangan.
- `js/leaderboard.js` — pengelolaan dan tampilan leaderboard.

## Keterhubungan file
`index.html` memuat `css/style.css` dan menjalankan `js/game.js` sebagai ES module.
`js/game.js` mengimpor `showLeaderboard()` dari `js/leaderboard.js`.

## Leaderboard (Firebase Firestore)
- `js/firebase-config.js` — isi dengan config Web App dari Firebase Console.
- `js/leaderboard.js` — `submitScore()`, `getTopScores()`, `showLeaderboard()`.
- `firestore.rules` — aturan keamanan; tempel di Firestore > Rules lalu Publish.
- Skor otomatis dikirim saat keenam rumah selesai dijawab. Satu dokumen per nama pemain, hanya skor tertinggi yang disimpan.
- Jika `firebase-config.js` belum diisi, game memakai `localStorage` (hanya lokal).

Jalankan melalui local server (misalnya Live Server), bukan membuka file HTML langsung, agar JavaScript module berjalan konsisten.


## Sistem kuis rumah
- Enam rumah berisi enam pertanyaan yang diacak setiap permainan dimulai.
- Tiga soal esai dan tiga pilihan ganda; jawaban benar bernilai 15 poin.
- Setiap rumah hanya dapat diselesaikan sekali. Rumah yang sudah dijawab tidak dapat dimasuki lagi.
- Mansion terkunci sampai keenam pertanyaan selesai dijawab.
- Skor maksimal adalah 90 poin.
