// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2XqBwzAeHwgie3YoJ062KQh08t7Jzaf0",
  authDomain: "finance-tracker-76eb7.firebaseapp.com",
  projectId: "finance-tracker-76eb7",
  storageBucket: "finance-tracker-76eb7.firebasestorage.app",
  messagingSenderId: "357597968627",
  appId: "1:357597968627:web:1ce3e9ee2c3094f0dd1f86",
  measurementId: "G-2KBZEPQMS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export{ db, auth, provider, doc, setDoc}