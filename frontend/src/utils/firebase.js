import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3RrlSn0wl4sVO9JJjZX0pkBkLurfKZE0",
  authDomain: "podologa-fabricia.firebaseapp.com",
  projectId: "podologa-fabricia",
  storageBucket: "podologa-fabricia.firebasestorage.app",
  messagingSenderId: "862057567005",
  appId: "1:862057567005:web:cec60212b5e9f341acc7f4",
  measurementId: "G-1W6939VJX7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
