
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjPAaOz8FI6F8StG960SHmiQkb6uc0UX0",
  authDomain: "stylesnap-43637.firebaseapp.com",
  projectId: "stylesnap-43637",
  storageBucket: "stylesnap-43637.firebasestorage.app",
  messagingSenderId: "512215905981",
  appId: "1:512215905981:web:b53169d6d1683be01729d4"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)