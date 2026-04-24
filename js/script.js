/**
 * Role: Senior Frontend Engineer
 * Context: Firestore Integration for Donations and Contacts
 * Project: Fondazione Emeritus
 */

import { db, auth } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const modal = document.getElementById('donateModal');
const msgBox = document.getElementById('messageBox');
const msgContent = document.getElementById('messageContent');
let selectedAmount = 10;
let selectedArea = 'childhood';

// --- GESTIONE MODALE DONAZIONI ---
function openDonateModal() {
    window.location.href = 'donazioni.html';
}

function closeDonateModal() { 
    if(modal) modal.style.display = 'none'; 
}

function selectAmount(val) {
    selectedAmount = val;
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.classList.remove('border-emeritus-yellow', 'bg-yellow-50', 'text-blue-900');
        if (parseInt(btn.innerText.replace('€', '')) === val) {
            btn.classList.add('border-emeritus-yellow', 'bg-yellow-50', 'text-blue-900');
        }
    });
    const customAmt = document.getElementById('customAmount');
    if (customAmt) customAmt.value = '';
}

function selectArea(area) {
    selectedArea = area;
    document.querySelectorAll('.area-btn').forEach(btn => {
        btn.classList.remove('border-emeritus-yellow', 'bg-yellow-50', 'text-blue-900');
        if (btn.dataset.area === area) {
            btn.classList.add('border-emeritus-yellow', 'bg-yellow-50', 'text-blue-900');
        }
    });
}

// --- SALVATAGGIO DONAZIONE SU FIRESTORE ---
async function confirmDonation() {
    const custom = document.getElementById('customAmount')?.value;
    const finalAmount = custom || selectedAmount;
    
    // Raccolta dati donatore
    const dName = document.getElementById('donorName')?.value || "";
    const dSurname = document.getElementById('donorSurname')?.value || "";
    const dEmail = document.getElementById('donorEmail')?.value || "";
    
    if(!dName || !dEmail) {
        alert("Per favore, inserisci almeno il nome e l'email.");
        return;
    }
    
    const btn = document.querySelector('button[onclick="confirmDonation()"]');
    const originalText = btn.innerHTML;
    const lang = localStorage.getItem('emeritus_lang') || 'it';
    
    // Feedback Caricamento
    btn.disabled = true;
    btn.innerText = window.translations[lang] ? (window.translations[lang]['donation_processing'] || "Elaborazione...") : "Elaborazione...";
    
    try {
        const user = auth.currentUser;
        
        // 1. Salvataggio nel Database Firestore
        await addDoc(collection(db, "donations"), {
            userId: user ? user.uid : "guest",
            donorName: `${dName} ${dSurname}`,
            userEmail: dEmail,
            amount: parseFloat(finalAmount),
            area: selectedArea,
            status: "pending",
            date: new Date().toISOString(),
            currency: "EUR"
        });

        // 2. Invio automatico notifica via EmailJS
        if (typeof emailjs !== 'undefined') {
            console.log("Tentativo invio EmailJS...");
            const donationDetails = `NUOVA PROMESSA DI DONAZIONE\nImporto: €${finalAmount}\nArea: ${selectedArea}\nDonatore: ${dName} ${dSurname}\nEmail: ${dEmail}`;
            
            const templateParams = {
                senderName: `${dName} ${dSurname}`,
                senderEmail: dEmail,
                messageContent: donationDetails
            };

            await emailjs.send("service_6gormxq", "template_b0k2lzj", templateParams)
                .then(() => console.log("Email inviata con successo!"))
                .catch((err) => console.error("Errore invio EmailJS:", err));
        }

        // Feedback Successo
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            let areaText = window.translations[lang] ? (window.translations[lang][`area_${selectedArea}`] || selectedArea) : selectedArea;
            
            let msg = "";
            if(lang === 'it') msg = `Grazie ${dName}! La tua promessa (€${finalAmount}) è stata inviata con successo. Riceverai presto le istruzioni via email.`;
            else if(lang === 'en') msg = `Thank you ${dName}! Your pledge (€${finalAmount}) was sent successfully. You will receive instructions via email soon.`;
            else if(lang === 'ro') msg = `Mulțumim ${dName}! Promisiunea ta (€${finalAmount}) è stata trimisă cu succes. Vei primi instrucțiunile prin e-mail în curând.`;
            
            showMessage(msg);
            
            // Opzionale: Reset campi
            document.getElementById('donorName').value = "";
            document.getElementById('donorSurname').value = "";
            document.getElementById('donorEmail').value = "";
            if(document.getElementById('customAmount')) document.getElementById('customAmount').value = "";
            
        }, 800);

    } catch (error) {
        console.error("Firestore Error:", error);
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert("Errore nel salvataggio della donazione. Riprova più tardi.");
    }
}

// --- UTILITY UI ---
function showMessage(text) {
    if(!msgBox || !msgContent) return;
    msgContent.innerText = text;
    msgBox.classList.remove('opacity-0', 'translate-y-10');
    msgBox.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
        msgBox.classList.add('opacity-0', 'translate-y-10');
    }, 5000);
}

function changeLanguage(lang) {
    if (!window.translations[lang]) return;
    localStorage.setItem('emeritus_lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (window.translations[lang][key]) {
            if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                el.placeholder = window.translations[lang][key];
            } else {
                el.innerHTML = window.translations[lang][key];
            }
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('font-bold', 'text-blue-900');
        btn.classList.add('text-gray-400');
        if (btn.innerText.toLowerCase() === lang) {
            btn.classList.add('font-bold', 'text-blue-900');
            btn.classList.remove('text-gray-400');
        }
    });
}

// --- ESPOSIZIONE GLOBALE PER ONCLICK ---
window.openDonateModal = openDonateModal;
window.closeDonateModal = closeDonateModal;
window.selectAmount = selectAmount;
window.selectArea = selectArea;
window.confirmDonation = confirmDonation;
window.changeLanguage = changeLanguage;
window.handleContactForm = handleContactForm;

// --- INIZIALIZZAZIONE ---
window.onclick = (e) => { if (e.target == modal) closeDonateModal(); }

document.addEventListener('DOMContentLoaded', () => {
    // Visitor Counter
    let count = localStorage.getItem('emeritus_visitor_count') || 12450;
    count = parseInt(count) + 1;
    localStorage.setItem('emeritus_visitor_count', count);
    const vc = document.getElementById('visitorCount');
    if (vc) vc.innerText = `Visite: ${count.toLocaleString('it-IT')}`;

    // Language
    const storedLang = localStorage.getItem('emeritus_lang') || 'it';
    changeLanguage(storedLang);
    
    // Contact Form Listener
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Inizializzazione EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("mirJZLLUfJv4xCxxg");
    }

    // Default selection
    selectAmount(10);

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
    }
});

async function handleContactForm(e) {
    if(e) e.preventDefault();
    
    const name = document.getElementById('contactName')?.value;
    const email = document.getElementById('contactEmail')?.value;
    const message = document.getElementById('contactMessage')?.value;
    const btn = e.target.querySelector('button[type="submit"]');
    
    if(!name || !email || !message) return;
    
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerText = "Inviando...";

    try {
        // 1. Salvataggio su Firestore
        await addDoc(collection(db, "messages"), {
            senderName: name,
            senderEmail: email,
            messageContent: message,
            timestamp: new Date().toISOString(),
            status: "new"
        });

        // 2. Invio Email tramite EmailJS (se disponibile)
        if (typeof emailjs !== 'undefined') {
            const templateParams = {
                senderName: name,
                senderEmail: email,
                messageContent: message
            };
            await emailjs.send("service_6gormxq", "template_b0k2lzj", templateParams);
        }

        showMessage("Messaggio inviato con successo! Ti risponderemo al più presto.");
        e.target.reset();
    } catch (error) {
        console.error("Contact Form Error:", error);
        alert("Errore nell'invio del messaggio. Riprova più tardi.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

