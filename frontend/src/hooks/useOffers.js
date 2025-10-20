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
import { useState, useEffect, useCallback, useMemo } from 'react';
import useDebounce from './useDebounce'; 
import useLocalStorage from './useLocalStorage';

//* URL BASE PER LA CHIAMATA API
const API_BASE_URL = 'http://localhost:3001/companyoffers';

const INITIAL_FILTERS = {
    // FILTRI PER LA FETCH (API)
    search: '',     
    category: '',   
    // FILTRI LATO CLIENT (TRATTE)
    origin: '',
    destination: '',
    // FILTRI ORDINAMENTO
    sortBy: 'title',
    sortOrder: 'asc'
};


export default function useOffers() {
    // STATO DATI E UI
    const [allOffers, setAllOffers] = useState([]); // Array delle offerte COMPLETE *non* filtrate
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // Stato per la gestione errori
    
    // STATO FILTRI AVANZATI
    const [filters, setFilters] = useState(INITIAL_FILTERS); // Stato per i filtri avanzati
    const debouncedFilters = useDebounce(filters, 300); // Debounce sui filtri

    // STATO INTERAZIONI AVANZATE (HOOK AUSILIARI)
    const [favoriteIds, setFavoriteIds] = useLocalStorage('favorites', []); 
    const [comparisonList, setComparisonList] = useLocalStorage('comparison', []);

    //* wrappo la funzione di fetching con USECALLBACK per evitare ricreazioni inutili
    const fetchFullOffers = useCallback(async () => {
        //* imposto lo stato di caricamento a true
        setIsLoading(true);
        //* pulisco eventuali errori
        setError(null);
        //* pulisco l'array di offerte completa prima di una nuova ricerca
        setAllOffers([]); // Pulisco l'array completo, non 'offers'

        try {
            //* CHIAMATA PARZIALE
        // costruisco i parametri di query (search + category) x filtrare il risultato
        const query = new URLSearchParams();
        if (debouncedFilters.search) query.append('search', debouncedFilters.search);
        if (debouncedFilters.category) query.append('category', debouncedFilters.category);

        const listUrl = `${API_BASE_URL}?${query.toString()}`
        console.log(`[Fetch] Richiesta lista parziale: ${listUrl}`)

        //* PRIMA FETCH (restituisce solo ID, title, category, ecc.)
        const listResponse = await fetch(listUrl);
        if(!listResponse.ok) throw new Error("Errore nel recupero della lista parziale");

        const partialOffers = await listResponse.json()

        console.log("[DEBUG] partialOffers length:", partialOffers.length);
        console.log("[DEBUG] partialOffers data:", partialOffers);

        if (partialOffers.length === 0) {
            setAllOffers([]); // Usa setAllOffers, non setOffers
            setIsLoading(false)
            return; // nulla da fare se la lista è vuota
        }

        //* SECONDA FETCH (chiamate multiple x fetching completo)
        // Mappa l'array parziale per creare una Promise di fetch per ogni ID.
        const fullOfferPromises = partialOffers.map(partial => 
            
            (partial.id ? 
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
                : null // Se l'ID è nullo/undefined, restituisce null per la Promise.all
            )
        ).filter(p => p !== null); // Filtra via gli eventuali 'null' prima del Promise.all

        // attendo che tutte le Promises siano risolte (DOPPIO FETCH COMPLETATO)
        const fullOffers = (await Promise.all(fullOfferPromises)).filter(offer => offer !== null);

        // aggiorno lo stato con l'array di offerte completo
        setAllOffers(fullOffers)
        } catch (error) {
            console.error("Errore fatale nel fetching delle offerte:", error)
            setError("Impossibile caricare i dati dal server.");
        } finally {
            //imposto lo stato di caricamento a false in ogni caso
            setIsLoading(false)
        }
    }, [debouncedFilters.search, debouncedFilters.category]); //la funzione si ricrea solo se i filtri cambiano

    //* useEffect x eseguire la fetch al mount dell'hook
    useEffect(() => {
        fetchFullOffers();
    }, [fetchFullOffers]);

    //* useMemo
    const filteredOffers = useMemo(() => { 
        //estrazione parametri di ordinamento
    const {
        sortBy,
        sortOrder,
    } = debouncedFilters;

    if (!allOffers || allOffers.length === 0) return [];

    const currentSearchTerm = debouncedFilters.search.toLowerCase();

    // 2. Esecuzione del Filtraggio
    let filtered = allOffers.filter(offer => {
        if (debouncedFilters.origin && offer.origin !== debouncedFilters.origin) return false;
        if (debouncedFilters.destination && offer.destination !== debouncedFilters.destination) return false;
        
        
        // Ricerca su tutti i campi rilevanti (title, origin, destination)
        if (currentSearchTerm) {
            const searchFields = [
                offer.title,
                offer.origin,
                offer.destination,
                offer.category
            ];

            // Se NESSUNO dei campi contiene il termine di ricerca, escludo l'offerta.
            const matchesSearch = searchFields.some(field => 
                field && field.toLowerCase().includes(currentSearchTerm)
            );

            if (!matchesSearch) return false;
        }

        return true;
    });

    // 3. Esecuzione dell'Ordinamento
    // Uso .slice() per creare una copia ed evitare di modificare l'array originale (allOffers o filtered)
    const sorted = filtered.slice().sort((a, b) => {
        const aVal = a[sortBy] || '';
        const bVal = b[sortBy] || '';

        // Gestione del confronto (stringhe e numeri)
        let comparison = 0;

        if (typeof aVal === 'string') {
            comparison = aVal.localeCompare(bVal);
        } else if (aVal > bVal) {
            comparison = 1;
        } else if (aVal < bVal) {
            comparison = -1;
        }

        // 4. Applicazione della Direzione
        // Se l'ordinamento è 'desc', invertiamo il risultato del confronto.
        return sortOrder === 'desc' ? comparison * -1 : comparison;
    });

    return sorted; // Restituisce l'array filtrato E ordinato
}, [allOffers, debouncedFilters]);

// Uso useMemo per calcolare i valori unici solo quando 'allOffers' cambia
const availableCategories = useMemo(() => {
    const categories = new Set(allOffers.map(o => o.category));
    return Array.from(categories);
}, [allOffers]);

const availableOrigins = useMemo(() => {
    const origins = new Set(allOffers.map(o => o.origin));
    return Array.from(origins);
}, [allOffers]);

const availableDestinations = useMemo(() => {
    const destinations = new Set(allOffers.map(o => o.destination));
    return Array.from(destinations);
}, [allOffers]);

    
    //* FUNZIONI DI UPDATE (Callbacks)
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const toggleFavorite = useCallback((id) => {
        setFavoriteIds(prev => (prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]));
    }, [setFavoriteIds]);

    const toggleComparison = useCallback((id) => {
    setComparisonList(prev => {
        const isCompared = prev.includes(id);

        if (isCompared) {
            // RIMOZIONE: questa parte dovrebbe essere perfetta
            return prev.filter(compId => compId !== id); 
        }

        // AGGIUNTA: la logica del limite è qui, ma non dovrebbe causare il bug di RIMOZIONE
        if (prev.length < 3) {
            return [...prev, id]; 
        }

        return prev;
    });
    }, [setComparisonList]);


    // ----------------------------------------------------
    // RITORNO FINALE (10 PROPRIETÀ RICHIESTE DA OfferListPage)
    // ----------------------------------------------------
    return {
        offers: filteredOffers, // Array di offerte *filtrate* e COMPLETE
        allOffers: allOffers,
        isLoading,
        error, // RESTITUISCO LO STATO ERRORE
        filters, // RESTITUISCO LO STATO FILTRI AVANZATI
        updateFilters, // RESTITUISCO LA FUNZIONE DI UPDATE
        
        availableCategories, // RESTITUISCO I DATI PER IL FILTRO CATEGORIE
        availableOrigins, // RESTITUISCO I DATI PER IL FILTRO ORIGINE
        availableDestinations, // RESTITUISCO I DATI PER IL FILTRO DESTINAZIONE

        favoriteIds, // RESTITUISCO L'ARRAY DI ID PREFERITI
        toggleFavorite, // RESTITUISCO LA FUNZIONE TOGGLE
        comparisonList, // RESTITUISCO L'ARRAY DI ID CONFRONTO
        toggleComparison, // RESTITUISCO LA FUNZIONE TOGGLE
    };
}

