// =============================================
// FIREBASE CONFIG - HANYA KONFIGURASI
// =============================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdFZ6uN0TztYVbF0Bw1XhZlX-FHplYPIs",
  authDomain: "oneskyoutdoor.firebaseapp.com",
  projectId: "oneskyoutdoor",
  storageBucket: "oneskyoutdoor.firebasestorage.app",
  messagingSenderId: "533255925908",
  appId: "1:533255925908:web:dd280a953c8ab33cd38481"
};

// Inisialisasi Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Ekspor services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;