// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from 'firebase/auth'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaVXgOh2N9zU7FECfBQ4KIX9-lp_6ZFIg",
  authDomain: "article-webiste.firebaseapp.com",
  projectId: "article-webiste",
  storageBucket: "article-webiste.firebasestorage.app",
  messagingSenderId: "372172410882",
  appId: "1:372172410882:web:083c7d695278b55e11171b",
  databaseURL:"https://console.firebase.google.com/project/article-webiste/database/article-webiste-default-rtdb/data/~2F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
export {app,auth}