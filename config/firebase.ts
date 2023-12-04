import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZy6uAkAIF6-TO_zyOFhLuNfkGGncahxE",
  authDomain: "travel-app-exam.firebaseapp.com",
  projectId: "travel-app-exam",
  storageBucket: "travel-app-exam.appspot.com",
  messagingSenderId: "6302152483",
  appId: "1:6302152483:web:b42623256f711851e5fe96",
  measurementId: "G-03NLFVPPND"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);