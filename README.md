# PMR Adventure

## Struktur
- `index.html` — halaman utama dan elemen UI.
- `css/style.css` — seluruh tampilan.
- `js/game.js` — logika game, karakter, map, kontrol, dialog, dan perpindahan ruangan.
- `js/leaderboard.js` — pengelolaan dan tampilan leaderboard.

## Keterhubungan file
`index.html` memuat `css/style.css` dan menjalankan `js/game.js` sebagai ES module.
`js/game.js` mengimpor `showLeaderboard()` dari `js/leaderboard.js`.

## Catatan leaderboard
Leaderboard saat ini menggunakan `localStorage`, sehingga data hanya tersimpan pada browser/perangkat yang sama. Ini adalah fondasi agar UI dan logika leaderboard sudah terpisah dari game. Agar leaderboard online bisa dipakai bersama oleh semua pemain, sambungkan `API_URL` di `js/leaderboard.js` ke backend (misalnya Firebase) dan sesuaikan endpoint GET/POST.

Game sumber belum memiliki sistem kuis/skor yang benar-benar berjalan. Karena itu, modul leaderboard belum otomatis menerima skor dari kuis. Setelah sistem kuis ditambahkan, panggil:
`submitScore({ name: namaPemain, score: totalPoin })`
dari `js/game.js` dan impor fungsi tersebut dari `leaderboard.js`.

Jalankan melalui local server (misalnya Live Server), bukan membuka file HTML langsung, agar JavaScript module berjalan konsisten.


## Sistem kuis rumah
- Enam rumah berisi enam pertanyaan yang diacak setiap permainan dimulai.
- Tiga soal esai dan tiga pilihan ganda; jawaban benar bernilai 15 poin.
- Setiap rumah hanya dapat diselesaikan sekali. Rumah yang sudah dijawab tidak dapat dimasuki lagi.
- Mansion terkunci sampai keenam pertanyaan selesai dijawab.
- Skor maksimal adalah 90 poin.
