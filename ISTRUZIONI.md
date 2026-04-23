# Istruzioni per lo Sviluppo del Sito EMERITUS

Questo file contiene le istruzioni essenziali per avviare il sito sul tuo computer prima della pubblicazione ufficiale.

## Come avviare il sito in locale (Test)
Per evitare errori di sicurezza del browser (ad esempio con TailwindCSS o con il caricamento delle traduzioni locali), **non aprire direttamente il file `index.html` facendo doppio clic**.

Utilizza invece il server locale di Python (che è già installato nel tuo computer):

1. Apri un **Terminale** (o Prompt dei comandi) all'interno di questa cartella (`c:\Users\Utente\Desktop\sito emeritus`).
2. Digita il seguente comando e premi Invio:
   ```bash
   python -m http.server 8000
   ```
3. Lascia la finestra del Terminale aperta.
4. Apri il tuo browser preferito (Chrome, Edge, Safari, ecc.) e vai all'indirizzo:
   [http://localhost:8000](http://localhost:8000)

Ogni volta che modifichi un file HTML, JS o CSS in questa cartella, ti basterà aggiornare la pagina del browser (premendo F5) per vedere immediatamente le modifiche.

---

## Prossimi Passi (Pubblicazione)
Come discusso, domani vedremo come mettere il sito online gratuitamente. Le opzioni migliori e più affidabili per un sito statico (HTML/CSS/JS) come questo sono:
- **Netlify**
- **Vercel**
- **GitHub Pages**

Tutte queste piattaforme sono sicure, molto veloci e offrono hosting gratuito a vita per i siti vetrina. Al momento giusto valuteremo insieme quale usare!

---

## Integrazione Backend / Firebase per Area Donatori

Al momento l'**Area Donatori** (Login, Registrazione e Dashboard) funziona in maniera "Simulata" (*Mock*). I dati vengono salvati temporaneamente nel browser tramite `localStorage`. Questo serve per testare il flusso utente ("User Flow") visivamente e senza costi server o ritardi. 

Per rendere le pagine reali e attive in futuro, ti consigliamo di utilizzare **Firebase** di Google. Ecco i passaggi dettagliati per lo sviluppatore:

### 1. Setup Progetto Firebase
- Vai su [Firebase Console](https://console.firebase.google.com/) e crea un nuovo progetto (es. *Emeritus-Portal*).
- Clicca sull'icona Web (`</>`) per registrare l'app Web e copia la configurazione SDK (il blocco `firebaseConfig`).

### 2. Attivazione Autenticazione (Auth)
- Nel menu di sinistra di Firebase, clicca su **Authentication** -> **Get Started**.
- Abilita il provider **Email/Password**.
- Nelle impostazioni (Settings), abilita (se richiesto) l'opzione per l'invio del link di *Email Verification* per la sicurezza.

### 3. Sostituzione Codice (Frontend)
- Apri `js/auth.js`.
- Importa l'SDK di Firebase in testa al file (o tramite `<script type="module">` su `accesso-donatore.html`).
- Sostituisci il nostro finto `registerUser()` con il vero comando Firebase:
  ```javascript
  import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
  
  // Nella logica del form di registrazione:
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Invia la mail di conferma
      sendEmailVerification(userCredential.user);
      // Mostra messaggio "Controlla la posta"
    });
  ```
- Sostituisci `loginUser()` con `signInWithEmailAndPassword(auth, email, password)`.

### 4. Gestione Dati e Progetti (Firestore)
- Per salvare lo storico donazioni e l'avanzamento dei progetti, vai su **Firestore Database** e crea un database di produzione in *Cloud Firestore*.
- Crea due collezioni ("Tabelle"):
  - `users`: con ID utente, Nome, ecc.
  - `donations`: con storico donazioni e ID dei progetti finanziati.
- Recupera i dati nella dashboard usando i metodi `getDocs` di Firestore invece che array statici.

---

## Gestione e Cancellazione Dati di Test (Mock)

Fin quando il sito utilizza il sistema simulato nel browser (`localStorage`), potresti aver bisogno di cancellare gli account finti (es. per fare nuovi test da zero senza che la mail risulti "già registrata"). 

Hai due modi molto semplici per farlo:

### Metodo 1: Tramite gli Strumenti per Sviluppatori (Browser DevTools)
1. Apri la pagina del sito (`http://localhost:8000`).
2. Premi **F12** (o clicca col destro in un punto vuoto e seleziona **Ispeziona**).
3. Vai sulla scheda **Application** (o "Applicazione" / "Archiviazione" in italiano).
4. Sulla barra laterale sinistra, espandi la voce **Local storage** e clicca su `http://localhost:8000`.
5. Clicca col tasto destro sulle voci `ameritus_users` e `ameritus_current_user` e scegli **Delete** (Elimina), oppure clicca sull'icona del divieto (Clear all) in alto.
6. Ricarica la pagina: i dati saranno completamente azzerati.

### Metodo 2: Tramite Console JavaScript
1. Apri la pagina del sito e premi **F12** per aprire il pannello Sviluppatore.
2. Vai sulla scheda **Console**.
3. Incolla questo comando e premi Invio:
   ```javascript
   localStorage.removeItem('ameritus_users'); localStorage.removeItem('ameritus_current_user'); location.reload();
   ```
4. I dati fittizi verranno cancellati e la pagina si riavvierà.
