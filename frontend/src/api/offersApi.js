//! Scopo:
// Isolare la logica di comunicazione HTTP.
// La funzione getOffers:
// 1. recupererà i dati
// 2. gestirà la costruzione dinamica dei parametri di ricerca
// 3. gestirà l'interpretazione delle risposte di errore dal server

// 4. Definisco la BASE_URL

// 5. La funzione getOffers accetta un oggetto di filtri
// (che può contenere search e category) e li aggiunge all'URL come query string.export default function getOffers ({search, category}) {

//* 4. Definisco la BASE_URL
const BASE_URL = 'http://localhost:3001/companyoffers';

//** Funzione ausiliaria handleResponse per gestire le risposte di fetch 
// Mi assicuro che, se non è OK, gestisco l'errore in modo strutturato.
async function handleResponse(response) {
    if (!response.ok) {
        // Tenterò di leggere il corpo della risposta per errori dettagliati (come il 400 Bad Request)
        // Usiamo .catch(() => (null)) per gestire il caso in cui il corpo non sia JSON
        const errorBody = await response.json().catch(() => ({}));
        
        let errorMessage = `Errore HTTP ${response.status}: ${response.statusText}`;

        // Controllo se il backend ha restituito dettagli specifici sugli errori
        if (errorBody.error || errorBody.details || errorBody.message) {
            
            // Gestione specifica dell'errore 400 (Validazione)
            if (response.status === 400) {
                const validationError = new Error("Errore di validazione dei dati inviati.");
                // Aggiungo i dettagli Zod (o simili) per l'interfaccia utente
                validationError.details = errorBody.details; 
                throw validationError;
            }
            
            // Usiamo il messaggio più specifico fornito dal backend
            errorMessage = errorBody.error || errorBody.message || errorMessage;
        }

        // Lancio l'errore generico o specifico
        throw new Error(errorMessage);
    }
    
    // Se la risposta è OK, restituisco il JSON
    return response.json();
}


//* La funzione getOffers:
 // 1. recupererà i dati 
 // 2. gestisce la costruzione dinamica dei parametri di ricerca e 
 // 3. gestisce l'interpretazione delle risposte di errore dal server
 // 4. accetta un oggetto di filtri (che può contenere search e category) e li aggiunge all'URL come query string
//*
//* La funzione getOffers:
// 1. recupererà i dati, 2. gestisce la costruzione dinamica dei parametri, 3. gestisce gli errori
async function getOffers({ search, category } = {}) {
    
    const params = new URLSearchParams();
    
    // 2. Gestisco la costruzione dinamica dei parametri di ricerca
    if (search) {
        // Il backend (json-server, etc.) usa tipicamente '_q' o 'q' per la ricerca full-text
        // Assumo che il tuo server usi 'search' come parametro
        params.append('search', search); 
    }
    if (category) {
        params.append('category', category);
    }

    // Costruisco l'URL finale
    const query = params.toString();
    const url = query ? `${BASE_URL}?${query}` : BASE_URL;

    console.log(`Chiamata API: GET ${url}`);

    try {
        // 1. Eseguo la chiamata e 3. gestisco la risposta
        const response = await fetch(url);
        const data = await handleResponse(response);
        
        // Ritorno l'array delle offerte
        return data;
    } catch (error) {
        // Rilancio l'errore per essere gestito dal componente o dall'hook chiamante (useOffers)
        throw error; 
    }
}

// Esporto la funzione necessaria nel default object
export default {
    getOffers,
    getAllOffersMock: () => mockOffers
};


