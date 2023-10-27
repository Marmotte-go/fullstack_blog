// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCrtmwEPfsNef7iz1aTWmk9pqWNCC2xaM",
  authDomain: "marmottechat-f0b11.firebaseapp.com",
  projectId: "marmottechat-f0b11",
  storageBucket: "marmottechat-f0b11.appspot.com",
  messagingSenderId: "562643539624",
  appId: "1:562643539624:web:25909aa5d886c74156549d",
  measurementId: "G-MBR8M8Y8VQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export const analytics = getAnalytics(app);

