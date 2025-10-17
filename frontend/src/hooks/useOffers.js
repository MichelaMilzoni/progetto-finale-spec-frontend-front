//! Scopo
// Gestire il ciclo di vita dei dati (fetching, caricamento, errori)
// e implementare la logica di filtraggio lato client per le tratte (origin e destination),
// dato che il backend non le supporta come parametri di query.

//* Logica
// 1. Centralizzare la logica di gestione dello stato, inclusi:
// 2. Il caricamento iniziale dei dati (chiamando getOffers).
// 3. Il mantenimento dei filtri e l'applicazione del filtraggio lato client
    //(essenziale per la logica delle "tratte" che il backend non supporta direttamente).
// 4. La gestione degli stati di isLoading e error

import { useState, useEffect, useCallback, useMemo } from "react";
import offersApi from '../api/offersApi';
import { useLocalStorage } from './useLocalStorage';

export default function useOffers() {
    //* STATI:
    // elenco completo offerte
    const [offers, setOffers] = useState([]);
    // filtri 
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        origin: '',     
        destination: '',
    });                                         
    // booleano per attesa dati server
    const [isLoading, setIsLoading] = useState(true)
    // errori: memorizzare eventuali messaggi di errore di rete o di caricamento
    const [error, setError] = useState(null)
    // LocalStorage - preferiti + confronto
    const [favoriteIds, setFavoriteIds] = useLocalStorage('favorites', [])
    const [comparisonList, setComparisonList] = useState([])
    
    //* FUNZIONI
    // 1. aggiornare lo stato filters
    // (accetta un nuovo array di filtri e lo unisce a quelli esistenti)
    const updateFilters = useCallback((newFilters) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...newFilters
        }));
    }, []);

    // 2. useEffect x gestire il recupero dei dati
    // si attiva al mount e quando cambiano i filtri che l'API può gestire (search, category)
    useEffect(() => {
        // Estraggo solo i filtri che devono andare all'API
        const apiFilters = {
            search: filters.search,
            category: filters.category,
        }

        // recupero dati
        const fetchOffers = async () => {
            setIsLoading(true)
            setError(null)
            try {
                // chiamata con i filtri
                const data = await offersApi.getOffers(apiFilters);
                setOffers(data);
            } catch (error) {
                console.error("Errore nel recupero delle offerte:", error);
                setError(error.message || "Impossibile caricare le offerte.")
            } finally{
                setIsLoading(false)
            }
      };

      fetchOffers();
      // l'effetto si ricarica quando cambiano i filtri
      // origin/destination non inseriti perchè fetch inutili
    }, [filters.search, filters.category]);

    // 3. useMemo per memorizzare i filtri - tratte
    const filteredOffers = useMemo(() => {
        // se non ci sono offerte caricate o filtri restituisco l'array completo
        if (!offers || (filters.origin === '' && filters.destination === '')) {
            return offers;
        }

        return offers.filter(offer => {
            const matchesOrigin = filters.origin === '' || offer.origin.toLowerCase().includes(filters.origin.toLowerCase())
            const matchesDestination = filters.destination === '' || offer.destination.toLowerCase().includes(filters.destination.toLowerCase())

            // Un'offerta è visualizzata solo se corrisponde l'origine E la destinazione
            return matchesOrigin && matchesDestination;
        });

        // ricalcola solo quando cambia l'array base 'offers'
    }, [offers, filters.origin, filters.destination])

    // 3.1 useMemo per origini
    const availableOrigins = useMemo(() => {
        const origins = offers.map(o => o.origin).filter(Boolean);
        return [...new Set(origins)].sort();
    }, [offers])

    //3.2 useMemo per destinazioni
    const availableDestinations = useMemo(() => {
        const destinations = offers.map(o => o.destination).filter(Boolean);
        return [...new Set(destinations)].sort();
    }, [offers])

    //* funzione di interazione x logica preferiti(useLocalStorage)
    function toggleFavorite(offerId) {
        // dichiarazione e richiamo di setFavoriteIds a cui passo una funzione di aggiornamento
      setFavoriteIds((prevIds) => {
        // verifico se l'ID è già nell'array precedente
        if(prevIds.includes(offerId)) {
            // se presente: rimuovo l'ID 
            return prevIds.filter(id => id !== offerId) 
        } else {
            // se non presente: aggiungo l'ID
            return [...prevIds, offerId]
        }
      });
    }

      //* funzione di interazione x logica confronto(useLocalStorage)
      function toggleComparison(offerId) {setComparisonList((prevIds) => {
        // 1. Caso RIMOZIONE (ID già presente)
        if (prevIds.includes(offerId)) {
            return prevIds.filter(id => id !== offerId);
        }
        
        // 2. Caso LIMITE RAGGIUNTO (Non è presente, ma non c'è spazio)
        if (prevIds.length >= 3) {
            // Non aggiungere. Restituisco l'array precedente, bloccando l'aggiunta.
            console.warn("Raggiunto il limite massimo di 3 offerte per il confronto.");
            return prevIds; 
        }

        // 3. Caso AGGIUNTA (Non è presente e c'è spazio)
        return [...prevIds, offerId];
      });
      }

    // restituisco lo stato e le funzioni per i componenti React
    return {// Dati da visualizzare (già filtrati lato client)
    offers: filteredOffers,
    
    // Dati di stato (Generali)
    isLoading,
    error,
    
    // Logica filtri
    filters, 
    updateFilters,
    
    // Funzione per recuperare il set completo delle categorie, tratte
    availableCategories: [...new Set(offers.map(o => o.category))].sort(), 
    availableOrigins: availableOrigins, 
    availableDestinations: availableDestinations,
    
    // STATI E FUNZIONI DI INTERAZIONE:
    favoriteIds,       // Array di ID preferiti (da usare in OfferListItem per visualizzare lo stato)
    toggleFavorite,    // Funzione per salvare/rimuovere i preferiti
    
    comparisonList,    // Array di ID per il confronto (max 3)
    toggleComparison,  // Funzione per aggiungere/rimuovere dal confronto
    };
}