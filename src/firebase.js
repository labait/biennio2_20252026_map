// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQLJpTTAvN3x8XpIqd3roXBHBDX9ybg4M",
  authDomain: "laba-map-b4d19.firebaseapp.com",
  projectId: "laba-map-b4d19",
  storageBucket: "laba-map-b4d19.firebasestorage.app",
  messagingSenderId: "942888444772",
  appId: "1:942888444772:web:042ec68bbf1580bcbe9071",
  measurementId: "G-5Y2Q49WSVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, db, auth, googleProvider };