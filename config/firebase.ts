import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZy6uAkAIF6-TO_zyOFhLuNfkGGncahxE",
  authDomain: "travel-app-exam.firebaseapp.com",
  projectId: "travel-app-exam",
  storageBucket: "travel-app-exam.appspot.com",
  messagingSenderId: "6302152483",
  appId: "1:6302152483:web:b42623256f711851e5fe96",
  measurementId: "G-03NLFVPPND"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);