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
    // ✅ 1. Contenitore Fisso: Posizionato a sinistra (start-0), centrato verticalmente
    <div
      className="position-fixed top-50 start-0 translate-middle-y py-3 shadow-lg bg-white border border-primary rounded-end"
      style={{ width: "250px", zIndex: 1050 }}
    >
      {/* ✅ 2. Contenitore Interno Corretto: Rimosso 'container', impostato Flexbox verticale */}
      <div className="d-flex flex-column align-items-center px-3 w-100">
        <h6 className="text-primary mb-3">Confronto ({count}/3)</h6>

        {/* 3. Visualizzazione delle offerte selezionate (Colonna di elementi) */}
        <div className="d-flex flex-column mb-3 w-100">
          {offersToCompare.map((offer) => (
            <div
              key={offer.id}
              // Sfondo bianco/grigio per contrasto, bordo primario per accento
              className="d-flex justify-content-between align-items-center bg-light border border-primary-subtle rounded p-2 mb-1 small"
            >
              <span className="text-truncate me-2" style={{ maxWidth: "140px" }}>
                {offer.title}
              </span>

              {/* Bottone per rimuovere l'offerta (cambiato a btn-close nero) */}
              <button
                type="button"
                className="btn-close" // ✅ Usiamo il btn-close standard (non white)
                aria-label="Rimuovi"
                onClick={() => toggleComparison(offer.id)}
              ></button>
            </div>
          ))}
        </div>

        {/* 4. Pulsante di Azione (Link) - Largo al 100% (w-100) */}
        <div className="comparison-actions w-100">
          <Link
            to="/compare"
            // ✅ Usiamo btn-primary per coerenza cromatica
            className={`btn btn-primary fw-bold w-100 ${count < 2 ? "disabled" : ""}`}
            aria-disabled={count < 2}
          >
            Visualizza Confronto
          </Link>
        </div>
      </div>
    </div>
  );
}
