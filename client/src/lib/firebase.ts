import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDuzNdMR4Wuu-VR9bmQl0WfSej-hjonvFM",
  authDomain: "rewardhubcash.firebaseapp.com",
  databaseURL: "https://rewardhubcash-default-rtdb.firebaseio.com",
  projectId: "rewardhubcash",
  storageBucket: "rewardhubcash.firebasestorage.app",
  messagingSenderId: "173020883746",
  appId: "1:173020883746:web:fc370056754177c166137b",
  measurementId: "G-D833TQKJR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Configure providers
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

facebookProvider.setCustomParameters({
  'display': 'popup'
});
