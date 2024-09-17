// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import {getFirestore,doc,setDoc} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDzoUKBQCFj8F8mVlka7jFZGG8JTsOdG_E",
  authDomain: "personal-finance-tracker-5403c.firebaseapp.com",
  projectId: "personal-finance-tracker-5403c",
  storageBucket: "personal-finance-tracker-5403c.appspot.com",
  messagingSenderId: "804889556544",
  appId: "1:804889556544:web:1020c0fdba3df9fd7e11a5",
  measurementId: "G-YYFZ7V1ZE9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc} ;