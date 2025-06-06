import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCc40IogesvCCBiNgU6zHc1xGUFac90AaM",
  authDomain: "blood-donation-login-a0969.firebaseapp.com",
  projectId: "blood-donation-login-a0969",
  storageBucket: "blood-donation-login-a0969.appspot.com",
  messagingSenderId: "994239676732",
  appId: "1:994239676732:web:faa29779fa50fd94ae1e39"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin configuration
export const ADMIN_EMAILS = ['shakyaanshul158@gmail.com']; // Replace with your admin email

// Enable persistence
setPersistence(auth, browserLocalPersistence);

// Helper function to check if a user is admin
export const isAdminEmail = (email) => ADMIN_EMAILS.includes(email);

export { auth, db };
export default app;


