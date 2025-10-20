//! Scopo:
// COMPONENTE CHE VISUALIZZA IL DETTAGLIO

// src/pages/OfferDetailPage.jsx

import React from "react";
import { useParams, Link } from "react-router-dom";
import useOfferDetail from "../hooks/useOfferDetails";

export default function OfferDetailPage() {
  // 1. Ottieni l'ID dalla URL (es. da /offers/5, offerId sarà "5")
  const { offerId } = useParams();

  // 2. Chiama l'hook con l'ID
  const { offer, isLoading, error } = useOfferDetail(offerId);

  // 3. Gestione Stati UI
  if (isLoading) {
    return <div className="container py-4 mt-4">Caricamento dettagli offerta...</div>;
  }

  if (error) {
    return (
      <div className="container py-4 mt-4 error">
        <h2>Errore di Caricamento</h2>
        <p>Si è verificato un errore: {error}</p>
        <Link to="/">Torna al catalogo</Link>
      </div>
    );
  }

  if (!offer) {
    return <div className="container py-4 mt-4">Dettaglio non disponibile per l'offerta {offerId}.</div>;
  }

  // 4. Visualizzazione Dettaglio
  return (
    <div className="container py-4 mt-4 offer-detail">
      <h1>{offer.title}</h1>
      <p className="category">Categoria: {offer.category}</p>
      <p>Disponibilità flotta: {(offer.fleetAvailabilityPct * 100).toFixed(0)}%</p>
      <hr />

      <h2>Tratta e Condizioni</h2>
      <p>
        Da: {offer.origin} a {offer.destination} | Tempo Base: {offer.baseTimeDays} giorni
      </p>

      <h2>Dettagli Prezzo e Specifiche</h2>
      <p>Prezzo Base per Km: {offer.basePriceKm.toFixed(2)} €/Km</p>
      <p>Carico Massimo: {offer.maxPayloadKg} Kg</p>
      <p>Costo Soste Multiple: {offer.multiStopCostPct * 100}%</p>
      <p>Costo Servizi Video: {offer.videoCostPct * 100}%</p>
      <p>Assicurazione Inclusa: {offer.insuranceIncludedEuro} €</p>
      <p>Eco-friendly: {offer.isEcoFriendly ? "Sì" : "No"}</p>

      <hr />
      <h3>Descrizione Completa</h3>
      <p>{offer.description || "Nessuna descrizione dettagliata disponibile."}</p>

      <p className="contact-info">Per informazioni: {offer.contactInfo}</p>

      <Link to="/" className="back-link">
        ← Torna al Catalogo
      </Link>
    </div>
  );
}
