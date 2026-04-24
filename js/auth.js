/**
 * Role: Senior Frontend Engineer
 * Context: Firebase Auth Integration (Modular SDK v9+)
 * Project: Fondazione Emeritus
 */

import { auth, db } from './firebase-config.js?v=3';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    sendEmailVerification 
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// --- GESTIONE REGISTRAZIONE (SIGNUP) ---
async function registerUser(name, email, password) {
    try {
        // 1. Creazione utente su Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Invio Email di Verifica (Obbligatorio)
        await sendEmailVerification(user);

        // 3. Salvataggio dati aggiuntivi su Firestore
        await setDoc(doc(db, "users", user.uid), {
            displayName: name,
            email: email,
            role: "donor",
            createdAt: new Date().toISOString(),
            emailVerified: false
        });

        return { success: true, message: "Registrazione completata! Controlla la tua email per verificare l'account prima di accedere." };
    } catch (error) {
        console.error("Signup Error:", error.code);
        let message = "Errore durante la registrazione.";
        if (error.code === 'auth/email-already-in-use') message = "Questa email è già registrata.";
        if (error.code === 'auth/weak-password') message = "La password deve avere almeno 6 caratteri.";
        return { success: false, message };
    }
}

// --- GESTIONE ACCESSO (LOGIN) ---
async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // CONTROLLO CRITICO: Verifica Email
        if (!user.emailVerified) {
            await signOut(auth); // Effettua il logout se non verificato
            return { 
                success: false, 
                message: "Devi verificare la tua email prima di poter accedere. Controlla la tua casella di posta.",
                needsVerification: true 
            };
        }

        return { success: true };
    } catch (error) {
        console.error("Login Error:", error.code);
        let message = "Credenziali non valide o utente non trovato.";
        return { success: false, message };
    }
}

// --- GESTIONE LOGOUT ---
async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

// --- MONITORAGGIO STATO UTENTE (UI UPDATES) ---
onAuthStateChanged(auth, async (user) => {
    const authNavBtn = document.getElementById('authNavBtn');
    const authMobileBtn = document.getElementById('authMobileBtn');
    
    if (user && user.emailVerified) {
        // Utente loggato e verificato
        const loggedInHtml = `
            <a href="area-donatore.html" class="flex items-center gap-2 bg-primary/20 text-blue-900 px-4 py-2 rounded-full font-bold shadow-sm transition hover:bg-primary/30 text-sm">
                <span class="material-symbols-outlined text-sm">person</span>
                Area Donatore
            </a>
        `;
        const loggedInMobileHtml = `
            <a href="area-donatore.html" class="flex items-center justify-center gap-2 w-full py-3 bg-primary/20 text-blue-900 rounded-xl font-bold text-sm">
                <span class="material-symbols-outlined text-sm">person</span>
                Area Donatore
            </a>
        `;

        if (authNavBtn) authNavBtn.innerHTML = loggedInHtml;
        if (authMobileBtn) authMobileBtn.innerHTML = loggedInMobileHtml;
        
        // Se siamo nella dashboard, carica i dati reali
        if (document.getElementById('donorDashboardView')) {
            loadDashboardData(user);
        }
    } else {
        // Utente non loggato
        const loggedOutHtml = `
            <a href="accesso-donatore.html" class="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-bold text-sm bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg">
                <span class="material-symbols-outlined text-sm">login</span> Accedi
            </a>
        `;
        const loggedOutMobileHtml = `
            <a href="accesso-donatore.html" class="flex items-center justify-center gap-2 w-full py-3 bg-slate-200 text-slate-700 rounded-xl font-bold text-sm">
                <span class="material-symbols-outlined text-sm">login</span> <span data-i18n="auth_login_btn">Accedi</span>
            </a>
        `;

        if (authNavBtn) authNavBtn.innerHTML = loggedOutHtml;
        if (authMobileBtn) authMobileBtn.innerHTML = loggedOutMobileHtml;
    }
});

// Esempio di caricamento dati dashboard da Firestore
async function loadDashboardData(user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
        const userData = userDoc.data();
        if(document.getElementById('donorName')) document.getElementById('donorName').innerText = userData.displayName;
        if(document.getElementById('donorEmail')) document.getElementById('donorEmail').innerText = userData.email;
    }
}

// Esposizione funzioni al DOM (necessaria perché lo script è un modulo)
window.logoutUser = logoutUser;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.toggleAuthMode = toggleAuthMode;

function toggleAuthMode() {
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    if (loginBox.classList.contains('hidden')) {
        loginBox.classList.remove('hidden');
        registerBox.classList.add('hidden');
    } else {
        loginBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
    }
}

// --- EVENT LISTENERS DEI FORM ---
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const res = await loginUser(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value);
            if (res.success) {
                window.location.href = 'area-donatore.html';
            } else {
                alert(res.message);
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const pass = document.getElementById('regPassword').value;
            const confirmPass = document.getElementById('regConfirmPassword').value;

            if (pass !== confirmPass) {
                alert("Le password non coincidono. Riprova.");
                return;
            }

            const res = await registerUser(name, email, pass);
            if (res.success) {
                alert(res.message);
                location.reload(); // Torna al login
            } else {
                alert(res.message);
            }
        });
    }
});
