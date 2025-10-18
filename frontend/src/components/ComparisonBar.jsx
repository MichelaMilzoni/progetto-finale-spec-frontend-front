//! Scopo:
// visualizzare le offerte selezionate per il confronto e per fornire all'utente un modo per gestire la lista e,
// idealmente, avviare il confronto vero e proprio
import React from "react";

export default function ComparisonBar({ comparisonList = [], offers = [], toggleComparison }) {
  //* 1. Filtro l'array completo delle offerte per trovare solo quelle nella lista di confronto
  // Questo è necessario perché comparisonList contiene solo gli ID.
  const offersToCompare = offers.filter((offer) => comparisonList.includes(offer.id));

  //* 2. Condizione di rendering: non mostrare se la lista è vuota
  if (offersToCompare.length === 0) {
    return null; // Non renderizzare nulla
  }

  const count = offersToCompare.length;

  return (
    <div className="comparison-bar-fixed">
      <div className="comparison-list-display">
        {/* Visualizzazione delle offerte selezionate */}
        {offersToCompare.map((offer) => (
          <div key={offer.id} className="comparison-item">
            <span>{offer.title}</span>
            <button className="remove-btn" onClick={() => toggleComparison(offer.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="comparison-actions">
        {/* Pulsante per avviare l'azione di confronto */}
        <button
          className="compare-now-btn"
          // Questo pulsante potrebbe aprire un modal o reindirizzare a una pagina dedicata
          onClick={() => alert(`Avvio confronto tra ${count} offerte!`)}
          // x forzare un minimo di 2 offerte per il confronto:
          disabled={count < 2}
        >
          Confronta {count} Offerte
        </button>
      </div>
    </div>
  );
}
