import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOffersContext } from "../context/OffersContext";
import ComparisonCard from "../components/ComparisonCard";

const API_BASE_URL = "http://localhost:3001/companyoffers";

export default function ComparisonPage() {
  // 1. Ottiengo la lista degli ID da confrontare
  // Se uso un Context: const { comparisonList, toggleComparison } = useContext(OffersContext);
  // Se uso l'hook useOffers in un componente genitore: Devo passarlo via prop.
  // ** Io lo passo via Context/Prop per accedere a comparisonList**
  const { comparisonList, toggleComparison, allOffers } = useOffersContext();
  const [comparedOffers, setComparedOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Fetching dei dettagli completi
  useEffect(() => {
    if (comparisonList.length === 0) {
      setComparedOffers([]);
      return;
    }

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const promises = comparisonList.map((id) =>
          fetch(`${API_BASE_URL}/${id}`)
            .then((res) => res.json())
            .then((data) => data.CompanyOffer)
            .catch((err) => {
              console.error(`Errore fetch confronto ID ${id}:`, err);
              return null;
            })
        );

        const results = await Promise.all(promises);
        // Filtra via i null e aggiorna
        setComparedOffers(results.filter((offer) => offer !== null));
      } catch (err) {
        setError("Errore nel recupero dei dati per il confronto.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [comparisonList]); // Riesegui quando la lista di ID cambia

  // 3. Renderizzazione UI
  if (isLoading) return <div className="container">Caricamento dettagli per il confronto...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container py-4 mt-4 comparison-page">
      <Link to="/" className="back-link">
        ← Torna al Catalogo
      </Link>
      <h1>Confronto Dettagliato Offerte ({comparedOffers.length}/3)</h1>

      {comparisonList.length === 0 ? (
        <p>Nessuna offerta selezionata per il confronto.</p>
      ) : (
        <div className="comparison-grid">
          {/* Renderizza le offerte affiancate (max 3) */}
          {comparedOffers.map((offer) => (
            <ComparisonCard
              key={offer.id}
              offer={offer}
              onRemove={toggleComparison} // Funzione per rimuovere dall'array
            />
          ))}
        </div>
      )}
    </div>
  );
}
