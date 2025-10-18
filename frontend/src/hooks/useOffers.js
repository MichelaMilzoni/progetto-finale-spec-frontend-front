//! Scopo
// Gestire il ciclo di vita dei dati (fetching, caricamento, errori)
// e implementare la logica di filtraggio lato client per le tratte (origin e destination),
// dato che il backend non le supporta come parametri di query.

//* Logica
// 1. Centralizzare la logica di gestione dello stato, inclusi:
// 2. Il caricamento iniziale dei dati (chiamando getOffers).
// 3. Il mantenimento dei filtri e l'applicazione del filtraggio lato client
//    (essenziale per la logica delle "tratte" che il backend non supporta direttamente).
// 4. La gestione degli stati di isLoading e error

//* IMPORT
import { useState, useEffect, useCallback } from 'react';

//* URL BASE PER LA CHIAMATA API
const API_BASE_URL = 'http://localhost:3001/companyoffer';


export const useOffers = (searchQuery, categoryFilter) => {
    //* stato x le offerte complete (senza tipi)
    const [offers, setOffers] = useState([])
    //* stato x il caricamento
    const [isLoading, setIsLoading] = useState(false)

    //* wrappo la funzione di fetching con USECALLBACK per evitare ricreazioni inutili
    const fetchFullOffers = useCallback(async () => {
        //* imposto lo ststo di caricamento a true
        setIsLoading(true);
        //* pulisco l'array di offerte prima di una nuova ricerca
        setOffers([]);

        try {
            //* CHIAMATA
            // costruisco i parametri di query (search + category) x filtrare il risultato
            const query = new URLSearchParams();
            if (searchQuery) query.append('search', searchQuery);
            if (categoryFilter) query.append('category', categoryFilter);

            const listUrl = `${API_BASE_URL}?${query.toString()}`
            console.log(`[Fetch] Richiesta lista parziale: ${listUrl}`)

            //* PRIMA FETCH (restituisce solo ID, title, category, ecc.)
            const listResponse = await fetch(listUrl);
            if(!listResponse.ok) throw new Error("Errore nel recupero della lista parziale");

            const partialOffers = await listResponse.json()

            if (partialOffers.length === 0) {
                setOffers([])
                setIsLoading(false)
                return; // nulla da fare se la lista è vuota
            }

            //* SECONDA FETCH (chiamate multiple x fetching completo)
            // mappo l'array parziale per creare una Promise di fetch per ogni ID
            const fullOfferPromise = partialOffers.map(partial => 
                fetch(`${API_BASE_URL}/${partial.id}`)
                .then(res => {
                    if(!res.ok) throw new Error(`Errore nel recupero dettaglio per ID ${partial.id}`)
                    return res.json();
                })
                .then(data => {
                    // l'API di dettaglio restituisce l'oggetto completo nella proprietà 'CompanyOffer'
                    return data.CompanyOffer;
                })
                .catch(err => {
                    console.error(`Errore nel recupero del dettaglio per ID ${partial.id}`, err);
                    return null; // Ritorno null per non bloccare Promise.all
                })
            );

            // attendo che tutte le Promises siano risolte (DOPPIO FETCH COMPLETATO)
            const fullOffers = (await Promise.all(fullOfferPromises)).filter(offer => offer !== null);

            // aggiorno lo stato con l'array di offerte complete
            setOffers(fullOffers)

        } catch (error) {
            console.error("Errore fatale nel fetching delle offerte:", error)
            //! qui posso aggiungere un errore visivo per l'utente
        } finally {
            //imposto lo stato di caricamento a false in ogni caso
            setIsLoading(false)
        }
    }, [searchQuery, categoryFilter]); //la funzione si ricrea solo se i filtri cambiano

    //* useEffect x eseguire la fetch al mount dell'hook
    useEffect(() => {
        fetchFullOffers();
    }, [fetchFullOffers]);

    //* ritorno lo stato e la variabile di caricamento
    return {offers, isLoading }
}