//! Scopo:
// Gestire lo stato (un array di ID) persistente nel browser (tramite localStorage)
// e fornire funzioni per leggerlo e modificarlo

import { useEffect, useState } from "react";

//* Logica
// Funzione/Stato: --------------------> Logica: 
// useLocalStorage(key, initialValue) -> Funzione che accetta una chiave (FAVORITES_KEY) e un valore di default ([])
// Inizializzazione                   -> Quando l'hook si monta, deve prima tentare di leggere il valore (stringa JSON)
//                                       da localStorage usando la key.
//                                       Se trova qualcosa, lo analizza (JSON.parse) e lo usa come stato iniziale.
//                                       Altrimenti, usa initialValue.StatoUsa useState per mantenere l'array di ID in
//                                       memoria.
// Sincronizzazione                   -> (useEffect) Usa un useEffect che si attiva ogni volta che lo stato degli ID cambia.
//                                       Questo effetto deve scrivere il nuovo array di ID nel localStorage
//                                       (dopo averlo convertito in JSON con JSON.stringify).
// Valori di Ritorno                  -> L'hook deve restituire l'array di ID e una funzione per aggiornarlo (setValue).



//* 1. funzione useLocalStorage x sincronizzare lo stato con WebStorage
function useWebStorage (key, initialValue, storageType='local') {
    //* 2. determino quale oggetto storage usare (local o session)
    const storage = storageType === 'local'? window.localStorage : window.sessionStorage;

    //* 3. funzione x leggere il valore dello storage
    const readValue = () => {
        // evito errori SSR(server-side Rendering) dove window non esiste
        if(typeof window === 'undefined') {
            return initialValue
        } 

        try {
            const item = storage.getItem(key);
            // se item esiste, provo a deserializzarlo da stringa a oggetto/array
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Errore di lettura ${storageType}Storage [${key}]:`, error)
            return initialValue;
        }
    }

    //* 4. inizializzo lo stato con il valore letto dallo storage
    const [storedValue, setStoredValue] = useState(readValue);

    //* 5. funzione x salvare il nuovo valore in React e nello Storage
    const setValue = (value) => {
        // gestisco sia il passaggio di un nuovo valore che di una funzione
        const newValue = value instanceof Function ? value(storedValue) : value;
        // aggiorno lo stato in React
        setStoredValue(newValue);
    };

    //* L'aggiornamento di localStorage avviene DOPO il rendering

    useEffect(() => {
// salvo il nuovo valore nello storage
        if (typeof window !== 'undefined') {
            // Scrivo il valore persistente ogni volta che storedValue cambia
            try {
                storage.setItem(key, JSON.stringify(storedValue));
            } catch (error) {
                console.error(`Errore di scrittura ${storageType}Storage [${key}]:`, error);
            }
        }
    }, [key, storedValue, storageType]) // Dipende da key e storedValue
        return [storedValue, setValue];
    };

        
//* 6. esporto entrambe le varianti x comodità anche se uso localStorage
export function useLocalStorage(key, initialValue) {
    return useWebStorage(key, initialValue, 'local')
}

export function useSessionStorage(key, initialValue) {
    return useWebStorage(key, initialValue, 'session')
}

//* 7 Esporto la variante più comune come default
export default useLocalStorage;