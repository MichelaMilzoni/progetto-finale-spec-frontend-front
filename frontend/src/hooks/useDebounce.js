import { useState, useEffect } from 'react';

//* Ritorna un valore che cambia solo dopo un certo ritardo
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 1. Imposta un timer che aggiorna il valore ritardato
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 2. Cleanup: Annulla il timer precedente ad ogni cambio di 'value'
    // Questo è il cuore del debouncing: l'aggiornamento viene eseguito solo 
    // se non c'è una nuova battitura entro il 'delay'
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Riavvia l'effetto se 'value' o 'delay' cambiano

  return debouncedValue;
}