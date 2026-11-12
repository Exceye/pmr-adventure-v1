/*
 * Konfigurasi Firebase untuk PMR Adventure.
 *
 * Cara mengisi: Firebase Console > Project settings (ikon gear) > General >
 * "Your apps" > tambahkan Web app (</>) > salin isi firebaseConfig ke bawah ini.
 *
 * Catatan: nilai ini BUKAN rahasia (memang terlihat di browser). Keamanan data
 * dijaga oleh Firestore Security Rules (lihat firestore.rules), bukan oleh config ini.
 */
export const firebaseConfig = {
  apiKey: "ISI_API_KEY",
  authDomain: "ISI_PROJECT_ID.firebaseapp.com",
  projectId: "ISI_PROJECT_ID",
  storageBucket: "ISI_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "ISI_SENDER_ID",
  appId: "ISI_APP_ID"
};
