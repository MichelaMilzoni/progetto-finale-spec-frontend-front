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
    <div className="card">
      {" "}
      <div className="card-list">
        <section className="title-card-list">
          <h3>{highlightText(title, searchTerm)}</h3> {/* Uso highlightText */}
          <span className="category">({category})</span>
        </section>
        <section className="body-card-list">
          <p>
            <strong>Origine:</strong> {highlightText(origin, searchTerm)}
          </p>
          <p>
            <strong>Destinazione:</strong> {highlightText(destination, searchTerm)}{" "}
          </p>
          <p>
            <strong>Categoria:</strong> {category}
          </p>
          <p>
            <strong>Prezzo base/km:</strong> €{basePriceKm.toFixed(2)}
          </p>
          <p>
            <strong>Carico Max:</strong> {maxPayloadKg} kg
          </p>
          <p>
            <strong>Tempo Base:</strong> {baseTimeDays} giorni
          </p>
          <p>
            <strong>Assicurazione inclusa:</strong> €{insuranceIncludedEuro.toFixed(2)}
          </p>
          <p>
            <strong>Ecosostenibile:</strong> {isEcoFriendly ? "Sì ✅" : "No ❌"}
          </p>
          <p>
            <strong>Disponibilità Flotta:</strong> {(fleetAvailabilityPct * 100).toFixed(0)}%
          </p>
          <p className="description-text">
            <strong>Descrizione:</strong> {highlightText(description, searchTerm)}
          </p>
          <small>Ultimo aggiornamento: {formattedUpdateDate}</small>
        </section>
      </div>
      <div className="card-actions">
        <button
          className={`wishlist-button ${isFavorite ? "active" : ""}`}
          onClick={() => toggleFavorite(id)}
        >
          {isFavorite ? "Rimuovi dai Preferiti ★" : "Salva nei Preferiti ☆"}
        </button>
        <button
          className={`details-button ${isCompared ? "compared" : ""}`}
          onClick={() => toggleComparison(id)}
          disabled={isComparisonDisabled}
        >
          {isCompared ? "Rimuovi dal Confronto" : "Aggiungi al Confronto"}
          {isComparisonDisabled && " (Max 3)"}
        </button>
      </div>
    </div>
  );
}
