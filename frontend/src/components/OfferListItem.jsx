//! Scopo:
// Visualizzare i dettagli di una singola offerta e fornire
// i pulsanti di interazione

//* Logica:

// 1. Visualizzazione Dettagli: Accedo e rendo le proprietà dell'oggetto offer
//    (es. title, origin, destination, category, basePriceKm, description).

// 2. Formattazione: Posso usare toFixed(2) sul prezzo per renderlo un formato
//    valuta.

// 3. Pulsanti d'Azione (Placeholders):
//    Devo includere due pulsanti, anche se la loro logica sarà implementata nel prossimo step (Logica di Stato Avanzata):

// 4. "Dettagli / Confronta": Sarà usato per avviare il confronto.

// 5. "Salva nei Preferiti": Sarà usato per attivare la logica localStorage

import React from "react";
import { Link } from "react-router-dom";

//* Funzione di utilità per evidenziare il testo cercato.
const highlightText = (text, searchTerm) => {
  // Protezione contro text undefined e searchTerm vuota
  if (!text || !searchTerm) return text;

  const lowerText = text.toLowerCase();
  const lowerSearchTerm = searchTerm.toLowerCase();

  const startIndex = lowerText.indexOf(lowerSearchTerm);

  if (startIndex === -1) {
    return text;
  }

  const endIndex = startIndex + searchTerm.length;

  return (
    <>
      {text.substring(0, startIndex)}
      <strong className="highlight">{text.substring(startIndex, endIndex)}</strong>
      {text.substring(endIndex)}
    </>
  );
};

export default function OfferListItem({
  offer,
  allOffers,
  searchTerm,
  favoriteIds = [],
  toggleFavorite,
  comparisonList = [],
  toggleComparison,
}) {
  const {
    id,
    title = "",
    origin = "",
    destination = "",
    category = "",
    basePriceKm = 0,
    description = "",
    maxPayloadKg = 0,
    baseTimeDays = 1,
    vatRatePct = 0,
    multiStopCostPct = 0,
    satCostPct = 0,
    videoCostPct = 0,
    insuranceIncludedEuro = 0,
    isEcoFriendly = false,
    fleetAvailabilityPct = 0,
    updatedAt,
  } = offer || {};

  //* LOGICA STATI
  const isFavorite = favoriteIds.includes(id);
  const isCompared = comparisonList.includes(id);

  //* DISABILITAZIONE PULSANTE CONFRONTA - se la lista è piena
  const isComparisonDisabled = comparisonList.length === 3 && !isCompared;

  //* FORMATTAZIONE DATA
  let formattedUpdateDate = "N/A";

  if (updatedAt) {
    const dateObject = new Date(updatedAt);

    // Verifico che l'oggetto Date sia valido (controlla se non è "Invalid Date")
    if (!isNaN(dateObject)) {
      formattedUpdateDate = dateObject.toLocaleDateString("it-IT");
    }
  }

  return (
    // Usa le classi card standard: h-100 per altezza uniforme, shadow per ombreggiatura
    <div className="card h-100 shadow-sm border-0">
      {/* Corpo della Card */}
      <div className="card-body d-flex flex-column">
        {/* Sezione Titolo (Header della Card) */}
        <section className="mb-3 border-bottom pb-2">
          <div className="d-flex justify-content-between align-items-baseline">
            {/* Titolo e Link */}
            <Link to={`/offers/${id}`} className="text-decoration-none text-primary">
              {/* Usa h5 per un titolo più appropriato per la card */}
              <h5 className="card-title fw-bold">{highlightText(title, searchTerm)}</h5>
            </Link>

            {/* Categoria come badge */}
            <span className="badge bg-secondary text-white">{category}</span>
          </div>
        </section>

        {/* Sezione Dettagli (Body della Card) */}
        <section className="card-text small mb-3 flex-grow-1">
          <div className="row g-2">
            {/* Dettagli Tratta (Colonna 1) */}
            <div className="col-6">
              <p className="mb-1">
                <strong>Origine:</strong> {highlightText(origin, searchTerm)}
              </p>
              <p className="mb-1">
                <strong>Destinazione:</strong> {highlightText(destination, searchTerm)}
              </p>
              <p className="mb-1">
                <strong>Carico Max:</strong> {maxPayloadKg} kg
              </p>
            </div>

            {/* Dettagli Prezzo/Tempo (Colonna 2) */}
            <div className="col-6">
              <p className="mb-1 text-success fw-bold">
                <strong>Prezzo base/km:</strong> €{basePriceKm.toFixed(2)}
              </p>
              <p className="mb-1">
                <strong>Tempo Base:</strong> {baseTimeDays} giorni
              </p>
              <p className="mb-1">
                <strong>Assicurazione:</strong> €{insuranceIncludedEuro.toFixed(0)}
              </p>
            </div>
          </div>

          <hr className="my-2" />

          {/* Riga Caratteristiche Speciali */}
          <div className="d-flex justify-content-between small">
            <span className={`fw-bold ${isEcoFriendly ? "text-success" : "text-danger"}`}>
              {isEcoFriendly ? "Ecosostenibile ✅" : "Non Ecosostenibile ❌"}
            </span>
            <span className="text-muted">
              Disponibilità Flotta: {(fleetAvailabilityPct * 100).toFixed(0)}%
            </span>
          </div>

          {/* Descrizione Breve */}
          <p className="mt-2 text-truncate" style={{ maxHeight: "2.5rem" }}>
            {highlightText(description, searchTerm)}
          </p>
        </section>

        {/* Aggiornamento Data */}
        <small className="text-muted mt-auto">Ultimo aggiornamento: {formattedUpdateDate}</small>
      </div>

      {/* Sezione Azioni (Card Footer) */}
      <div className="card-footer d-grid gap-2 d-md-flex justify-content-md-end bg-light border-top">
        {/* Pulsante Preferiti */}
        <button
          className={`btn btn-sm ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => toggleFavorite(id)}
        >
          {isFavorite ? "Rimuovi ★" : "Salva ☆"}
        </button>

        {/* Pulsante Confronto */}
        <button
          className={`btn btn-sm ${isCompared ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => toggleComparison(id)}
          disabled={isComparisonDisabled}
        >
          {isCompared ? "Rimuovi" : "Confronta"}
          {isComparisonDisabled && " (Max 3)"}
        </button>
      </div>
    </div>
  );
}
