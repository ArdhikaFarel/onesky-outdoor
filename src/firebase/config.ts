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

// =============================================
// SINGLE INITIALIZATION - MENCEGAH MULTIPLE INSTANCE
// =============================================

let app;
let auth;
let db;
let storage;

try {
  // Cek apakah sudah ada instance Firebase
  if (!getApps().length) {
    console.log('🔥 Initializing Firebase...');
    app = initializeApp(firebaseConfig);
  } else {
    console.log('🔥 Using existing Firebase instance...');
    app = getApp();
  }

  // Inisialisasi services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  console.log('✅ Firebase initialized successfully!');
  console.log(`📱 Project ID: ${firebaseConfig.projectId}`);
  console.log(`🌐 Auth Domain: ${firebaseConfig.authDomain}`);

} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  // Throw error agar bisa ditangani oleh error boundary
  throw new Error(`Firebase initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// =============================================
// VALIDASI SERVICES
// =============================================

if (!auth) {
  console.error('❌ Auth service not initialized!');
}

if (!db) {
  console.error('❌ Firestore service not initialized!');
}

if (!storage) {
  console.error('❌ Storage service not initialized!');
}

// =============================================
// EKSPOR SERVICES
// =============================================

export { auth, db, storage };
export default app;

// =============================================
// HELPER FUNCTION UNTUK CEK KONEKSI
// =============================================

export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Coba akses Firestore untuk cek koneksi
    const { doc, getDoc } = await import('firebase/firestore');
    const testDoc = doc(db, '_test_connection', 'test');
    await getDoc(testDoc);
    console.log('✅ Firebase connection test successful!');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return false;
  }
};

// =============================================
// HELPER FUNCTION UNTUK GET CURRENT USER
// =============================================

export const getCurrentUser = () => {
  if (!auth) {
    console.warn('⚠️ Auth not initialized');
    return null;
  }
  return auth.currentUser;
};

// =============================================
// HELPER FUNCTION UNTUK LOGOUT
// =============================================

export const logoutUser = async () => {
  try {
    if (!auth) {
      console.warn('⚠️ Auth not initialized');
      return;
    }
    await auth.signOut();
    console.log('👋 User logged out successfully');
  } catch (error) {
    console.error('❌ Logout failed:', error);
    throw error;
  }
};