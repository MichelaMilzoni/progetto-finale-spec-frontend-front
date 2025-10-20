import React from "react";
import { Link } from "react-router-dom"; // Necessario per il link al dettaglio

export default function ComparisonCard({ offer, onRemove }) {
  // Estraggo qui le prop che voglio mostrare nel confronto
  const {
    id,
    title,
    category,
    origin,
    destination,
    basePriceKm,
    maxPayloadKg,
    baseTimeDays,
    isEcoFriendly,
    multiStopCostPct,
  } = offer;

  return (
    // Uso della classe Card con un'ombra pronunciata (shadow-lg) per evidenziare
    <div className="card h-100 shadow-lg border-0 position-relative">
      {/* Pulsante per rimuovere l'offerta (posizione assoluta) */}
      <button
        onClick={() => onRemove(id)}
        className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2 rounded-circle p-0"
        style={{ width: "30px", height: "30px", lineHeight: "10px" }}
        title={`Rimuovi ${title} dal confronto`}
      >
        ✕
      </button>

      <div className="card-body d-flex flex-column">
        {/* Titolo e Categoria (Header della Card) */}
        <div className="mb-3">
          <Link to={`/offers/${id}`} className="text-decoration-none text-primary">
            <h4 className="card-title fw-bold">{title}</h4>
          </Link>
          <span className="badge bg-secondary">{category}</span>
        </div>

        <hr />

        {/* 📋 Lista delle metriche di confronto */}
        <section className="comparison-metrics flex-grow-1">
          {/* Le metriche sono presentate in una lista non ordinata Bootstrap */}
          <ul className="list-group list-group-flush small">
            {/* 1. TRATTA */}
            <li className="list-group-item d-flex justify-content-between">
              <strong>Tratta:</strong>
              <span>
                {origin} → {destination}
              </span>
            </li>

            {/* 2. PREZZO CHIAVE */}
            <li className="list-group-item d-flex justify-content-between">
              <strong>Prezzo Base/Km:</strong>
              <span className="text-success fw-bold">€{basePriceKm.toFixed(2)}</span>
            </li>

            {/* 3. CARICO */}
            <li className="list-group-item d-flex justify-content-between">
              <strong>Carico Max:</strong>
              <span>{maxPayloadKg} kg</span>
            </li>

            {/* 4. TEMPO */}
            <li className="list-group-item d-flex justify-content-between">
              <strong>Tempo Base:</strong>
              <span>{baseTimeDays} giorni</span>
            </li>

            {/* 5. EXTRA COSTI */}
            <li className="list-group-item d-flex justify-content-between">
              <strong>Costo Soste Multiple:</strong>
              <span>{(multiStopCostPct * 100).toFixed(0)}%</span>
            </li>

            {/* 6. ECOLOGIA */}
            <li className="list-group-item d-flex justify-content-between">
              <strong>Eco-friendly:</strong>
              <span className={isEcoFriendly ? "text-success" : "text-danger"}>
                {isEcoFriendly ? "Sì ✅" : "No ❌"}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
