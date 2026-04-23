# 📘 Manuale Operativo Fondazione Lions Emeritus
*Guida per la gestione e manutenzione del sito web*

---

## 1. Gestione dei Contenuti (GitHub)
Il codice del sito è ospitato su GitHub. Ogni modifica fatta nel repository si riflette online entro circa 60 secondi.

### Come modificare un testo o un'immagine:
1. Accedi a GitHub e vai nel repository `emeritusfoundation.org`.
2. **Per testi rapidi**: Clicca sul file `.html` (es. `index.html`), premi l'icona della matita, modifica il testo e clicca su **Commit changes**.
3. **Per nuove immagini**: Entra nella cartella `assets`, clicca su `Add file` -> `Upload files` e trascina la nuova immagine. 
   * *Attenzione: Mantieni lo stesso nome file se vuoi sostituire un'immagine esistente senza cambiare il codice.*

---

## 2. Gestione Donazioni e Lead (Firebase)
Tutti i dati sensibili degli utenti (promesse di donazione e messaggi) sono salvati su **Google Firebase**.

### Come visualizzare le donazioni raccolte:
1. Accedi alla [Console Firebase](https://console.firebase.google.com/).
2. Seleziona il progetto **emeritusfoundation**.
3. Nel menu a sinistra, clicca su **Build** -> **Firestore Database**.
4. Vedrai due "Collezioni":
   - 💰 **`donations`**: Qui trovi l'elenco di chi ha promesso una donazione (Importo, Area, Email dell'utente).
   - 📩 **`messages`**: Qui trovi i messaggi inviati tramite il modulo "Contatti".

### Verificare i nuovi utenti registrati:
1. Nella console Firebase, vai su **Authentication** -> **Users**.
2. Qui vedrai la lista degli utenti registrati e se hanno già verificato la loro email (indispensabile per la trasparenza).

---

## 3. Gestione del Dominio (Aruba & GitHub)
Il dominio è gestito da Aruba ma punta ai server GitHub.

- **Se il sito non è raggiungibile**: Controlla in GitHub Settings -> Pages che la voce **"Enforce HTTPS"** sia spuntata.
- **Autorizzazione Firebase**: Se cambi dominio o aggiungi un sottodominio, ricordati di aggiungerlo in Firebase Console -> Authentication -> Settings -> **Authorized Domains**.

---

## 4. Contatti Rapidi Emergenza
* **Piattaforma Hosting**: GitHub (Supporto gratuito tramite documentazione).
* **Database & Auth**: Firebase / Google Cloud (Piano gratuito "Spark").
* **Email Fondazione**: Gestita tramite Aruba.

---

*Documento creato il 22 Aprile 2026*  
*Fondazione Lions Emeritus - Building the New, Together.*
