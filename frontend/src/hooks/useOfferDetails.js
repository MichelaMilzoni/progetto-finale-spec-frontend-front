//! Scopo:
// HOOK PER IL FETCHING DELLA PAGINA DETTAGLIO

// src/hooks/useOfferDetail.js

import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/companyoffers';

export default function useOfferDetail(offerId) {
    const [offer, setOffer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!offerId) {
            setError('ID offerta non specificato.');
            setIsLoading(false);
            return;
        }

        // Resetta lo stato all'inizio di ogni fetch
        setIsLoading(true);
        setError(null);
        setOffer(null); 

        async function fetchOfferDetail() {
            try {
                const url = `${API_BASE_URL}/${offerId}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Offerta con ID ${offerId} non trovata.`);
                }

                const data = await response.json();
                
                // L'API restituisce l'oggetto dettaglio nella proprietà 'CompanyOffer'
                setOffer(data.CompanyOffer); 
            } catch (err) {
                // Cattura l'errore e aggiorna lo stato
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchOfferDetail();
        
    }, [offerId]); // Si attiva solo quando l'ID passato cambia

    return { offer, isLoading, error };
}