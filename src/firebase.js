import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCGP29cq54YHrsOaDkQyOBo9PR1vA-TTkA",
    authDomain: "klinofftravels.firebaseapp.com",
    projectId: "klinofftravels",
    storageBucket: "klinofftravels.firebasestorage.app",
    messagingSenderId: "673106751740",
    appId: "1:673106751740:web:f6ef60a62d4e1322342779",
    measurementId: "G-G1L9FE8QMM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);