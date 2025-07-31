import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAybiryKEudm1FXLNtSL7O2GoTNZAtBiSk",
  authDomain: "couponharvest-d0069.firebaseapp.com",
  projectId: "couponharvest-d0069",
  storageBucket: "couponharvest-d0069.firebasestorage.app",
  messagingSenderId: "241406331263",
  appId: "1:241406331263:web:2c3bd1193c038ae410f24a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 