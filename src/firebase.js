import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDhrv96fgaJDM6QUgJKscoAu8_6ROvRa_0",
    authDomain: "client-user-6e7de.firebaseapp.com",
    projectId: "client-user-6e7de",
    storageBucket: "client-user-6e7de.firebasestorage.app",
    messagingSenderId: "784952027265",
    appId: "1:784952027265:web:788474318fde19a2e98580",
    measurementId: "G-2F7SKCEGP2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);