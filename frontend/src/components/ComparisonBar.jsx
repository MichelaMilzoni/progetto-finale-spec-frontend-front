//! Scopo:
// visualizzare le offerte selezionate per il confronto e per fornire all'utente un modo per gestire la lista e,
// idealmente, avviare il confronto vero e proprio
import React from "react";
import { Link } from "react-router-dom";

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
    // Barra fissa in fondo (fixed-bottom), sfondo scuro (bg-dark) e padding
    <div className="fixed-bottom bg-dark py-2 shadow-lg border-top border-primary">
      <div className="container d-flex justify-content-between align-items-center">
        {/* 1. Visualizzazione delle offerte selezionate (Flexbox) */}
        <div className="d-flex flex-wrap align-items-center">
          <span className="text-light me-3 small d-none d-md-block">Offerte in confronto:</span>

          {offersToCompare.map((offer) => (
            <div
              key={offer.id}
              className="d-flex align-items-center bg-secondary text-white rounded-pill px-3 py-1 me-2 my-1 small"
            >
              <span className="text-truncate" style={{ maxWidth: "120px" }}>
                {offer.title}
              </span>

              {/* Bottone per rimuovere l'offerta */}
              <button
                type="button"
                className="btn-close btn-close-white ms-2" // Icona di chiusura bianca Bootstrap
                aria-label="Rimuovi"
                onClick={() => toggleComparison(offer.id)}
              ></button>
            </div>
          ))}
        </div>

        {/* 2. Pulsante di Azione (Link) */}
        <div className="comparison-actions">
          {/* Link al confronto. Disabilitato visivamente se count < 2 */}
          <Link
            to="/compare"
            // Bottone primario Bootstrap, disabilitato visivamente se count < 2
            className={`btn btn-warning fw-bold ${count < 2 ? "disabled" : ""}`}
            aria-disabled={count < 2}
          >
            Visualizza Confronto ({count}/3)
          </Link>
        </div>
      </div>
    </div>
  );
}
