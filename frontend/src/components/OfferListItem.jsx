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
  // 🚨 FIX: Protezione contro text undefined e searchTerm vuota
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
    title = "", // Default vuoto
    origin = "", // Default vuoto
    destination = "", // Default vuoto
    category = "",
    basePriceKm = 0,
    description = "",
  } = offer || {};

  //* LOGICA STATI
  const isFavorite = favoriteIds.includes(id);
  const isCompared = comparisonList.includes(id);

  //* DISABILITAZIONE PULSANTE CONFRONTA - se la lista è piena
  const isComparisonDisabled = comparisonList.length === 3 && !isCompared;

  return (
    <div className="card">
      <div className="card-list">
        <section className="title-card-list">
          <h3>{title}</h3>
        </section>

        <section className="body-card-list">
          <p>
            <strong>Origine:</strong> {origin}
          </p>
          <p>
            <strong>Destinazione:</strong> {destination}
          </p>
          <p>
            <strong>Categoria:</strong> {category}
          </p>
          <p>
            {/* 3. Formattazione corretta del prezzo */}
            <strong>Prezzo base/km:</strong> €{basePriceKm.toFixed(2)}
          </p>
          <p>
            <strong>Descrizione:</strong> {description}
          </p>
        </section>
      </div>

      {/* 4. Azioni e interazione con l'utente */}
      <div className="card-actions">
        <button
          className={`wishlist-button ${isFavorite ? "active" : ""}`}
          onClick={() => toggleFavorite(id)} // Passa l'ID al toggle
        >
          {isFavorite ? "Rimuovi dai Preferiti ★" : "Salva nei Preferiti ☆"}
        </button>

        <button
          className={`details-button ${isCompared ? "compared" : ""}`}
          onClick={() => toggleComparison(id)} // Passa l'ID al toggle
          disabled={isComparisonDisabled} // Disabilita se max 3 e non selezionata
        >
          {isCompared ? "Rimuovi dal Confronto" : "Aggiungi al Confronto"}
          {isComparisonDisabled && " (Max 3)"}
        </button>
      </div>
    </div>
  );
}
