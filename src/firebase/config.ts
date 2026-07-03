import { initializeApp } from "firebase/app";
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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);