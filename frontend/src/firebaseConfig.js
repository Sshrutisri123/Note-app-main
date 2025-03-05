import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBSj8lvMySHxYqt9yE3dsBu6qWxeQO-T78",
    authDomain: "noteapp-65118.firebaseapp.com",
    projectId: "noteapp-65118",
    storageBucket: "noteapp-65118.appspot.com", // ✅ Fix the typo (.app → .appspot.com)
    messagingSenderId: "443064722480",
    appId: "1:443064722480:web:8d05a913843c4b154f79f5",
    measurementId: "G-E0DZMJEGM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
