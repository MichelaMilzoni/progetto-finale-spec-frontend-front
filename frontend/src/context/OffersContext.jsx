import React, { createContext, useContext } from 'react';
import useOffers from '../hooks/useOffers'; // Il tuo hook esistente

// 1. Creo il Context
const OffersContext = createContext(null);

// 2. Creo un Provider
export const OffersProvider = ({ children }) => {
    // Chiama l'hook qui per ottenere TUTTI i dati globali
    const offersData = useOffers(); 

    return (
        <OffersContext.Provider value={offersData}>
            {children}
        </OffersContext.Provider>
    );
};

// 3. Creo un hook personalizzato per semplificare l'uso
export const useOffersContext = () => {
    return useContext(OffersContext);
};