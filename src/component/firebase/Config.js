// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCO5tIejHKs3asqRejyMhgNYkaqarCjd7g",
  authDomain: "projectcollaborationhub-25874.firebaseapp.com",
  projectId: "projectcollaborationhub-25874",
  storageBucket: "projectcollaborationhub-25874.firebasestorage.app",
  messagingSenderId: "499378089043",
  appId: "1:499378089043:web:7b556cb947d296457a6aa6",
  measurementId: "G-4BCJPHR95L"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auths  = getAuth(app);
export const googleProvider= new GoogleAuthProvider();