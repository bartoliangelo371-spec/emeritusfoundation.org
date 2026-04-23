// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// CONFIGURAZIONE REALE FIREBASE - Fondazione Emeritus
const firebaseConfig = {
  apiKey: "AIzaSyBunoeJv7jLa7l35qJnxH6NOOsmft0iw20",
  authDomain: "emeritusfoundation-c23a4.firebaseapp.com",
  projectId: "emeritusfoundation-c23a4",
  storageBucket: "emeritusfoundation-c23a4.firebasestorage.app",
  messagingSenderId: "352308960713",
  appId: "1:352308960713:web:22a9da4158156b97109c18",
  measurementId: "G-ZCFLYFHQRL"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Esporta i servizi per usarli in js/auth.js
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
