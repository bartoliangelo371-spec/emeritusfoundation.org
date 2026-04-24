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

## Integrazione Backend / Firebase per Area Donatori (PRODUZIONE)

L'**Area Donatori** (Login, Registrazione) è ora integrata **ufficialmente con Firebase in modalità reale** (produzione). Non è più una simulazione. Gli utenti vengono registrati realmente nel database di Firebase e devono verificare la loro email per poter accedere.

### Configurazione per la Pubblicazione Online (Obbligatoria)

Poiché l'Autenticazione è stata configurata per funzionare con chiavi API protette, per garantire che il login funzioni anche quando il sito è pubblicato sul dominio finale (`https://www.emeritusfoundation.org`), è assolutamente necessario eseguire due passaggi di autorizzazione nelle console di Google e Firebase.

#### 1. Autorizzare il dominio su Google Cloud Console (Restrizioni Chiave API)
Questo passaggio serve per evitare che altri siti rubino e usino la tua chiave API.
1. Vai su [Google Cloud Console](https://console.cloud.google.com/) e assicurati di aver selezionato il progetto `emeritusfoundation-c23a4`.
2. Vai su **API e Servizi** > **Credenziali**.
3. Clicca sulla chiave API associata a Firebase (solitamente chiamata "Browser key (auto created by Firebase)").
4. Scorri fino alla sezione **Limitazioni dell'applicazione** e assicurati che sia selezionato **Referrer HTTP (siti web)**.
5. Sotto la voce "Limitazioni per siti web", clicca su **Aggiungi un elemento** e inserisci esattamente:
   * `https://www.emeritusfoundation.org/*`
   * `https://emeritusfoundation.org/*`
   * (Mantieni anche `http://localhost:5500/*` e `http://localhost:5500` se vuoi continuare a testare in locale).
6. Clicca su **Salva**. (Nota: le modifiche possono impiegare fino a 10 minuti per propagarsi).

#### 2. Autorizzare il dominio su Firebase Console (Authentication)
Questo passaggio serve per dire a Firebase di accettare le richieste di login provenienti da questo dominio.
1. Vai su [Firebase Console](https://console.firebase.google.com/) e apri il progetto `emeritusfoundation-c23a4`.
2. Nel menu a sinistra, clicca su **Authentication** (sotto "Build" o "Crea").
3. Vai sulla scheda **Settings** (Impostazioni) e seleziona **Authorized domains** (Domini autorizzati).
4. Clicca sul pulsante **Add domain** (Aggiungi dominio).
5. Inserisci il dominio: `www.emeritusfoundation.org` (e poi ripeti l'operazione per inserire anche `emeritusfoundation.org` senza "www" per sicurezza, e NON inserire "https://" o gli "/").
6. Clicca su **Add**.

Una volta completati questi due passaggi, le funzioni di Registrazione e Accesso dell'Area Donatori saranno pienamente operative e sicure sul sito pubblico `https://www.emeritusfoundation.org`.

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
