import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useOffersContext } from "../context/OffersContext";
import OfferListItem from "../components/OfferListItem"; // Componente lista riutilizzabile

export default function FavoriteOffersPage() {
  // Accedo a tutti i dati e le funzioni necessari tramite il Context
  const {
    allOffers,
    favoriteIds,
    isLoading,
    error,
    toggleFavorite,
    toggleComparison,
    comparisonList,
    filters, // Necessario per passare searchTerm a OfferListItem
  } = useOffersContext();

  // 1. Filtro l'array completo solo per gli ID presenti in favoriteIds
  // Uso useMemo per ricalcolare la lista solo quando i dati cambiano
  const favoriteOffers = useMemo(() => {
    if (!allOffers || favoriteIds.length === 0) return [];

    // Eseguo il filtro: include solo le offerte il cui ID è in favoriteIds
    return allOffers.filter((offer) => favoriteIds.includes(offer.id));
  }, [allOffers, favoriteIds]);

  // 2. Gestione Stati UI
  if (isLoading) {
    return <div className="container py-4 mt-4">Caricamento delle offerte...</div>;
  }

  if (error) {
    return <div className="container py-4 mt-4 error">Errore nel caricamento dei dati: {error}</div>;
  }

  return (
    <div className="container py-4 mt-4 favorites-page">
      <Link to="/" className="back-link">
        ← Torna al Catalogo
      </Link>
      <h1>Le Mie Offerte Preferite ({favoriteOffers.length})</h1>

      {favoriteOffers.length === 0 ? (
        <p>
          Non hai ancora salvato nessuna offerta tra i preferiti. Torna al{" "}
          <Link to="/">Catalogo</Link> per aggiungerne alcune!
        </p>
      ) : (
        <div className="offer-list">
          {/* 3. Mappa e Riutilizza OfferListItem */}
          {favoriteOffers.map((offer) => (
            <OfferListItem
              key={offer.id}
              offer={offer}
              // Passa i dati di stato e le funzioni all'item
              searchTerm={filters.search}
              isFavorite={true} // In questa pagina, sono tutti preferiti
              isCompared={comparisonList.includes(offer.id)}
              toggleFavorite={toggleFavorite}
              toggleComparison={toggleComparison}
              // Disabilita il confronto se si è raggiunto il limite e l'offerta non è già selezionata
              isComparisonDisabled={
                comparisonList.length >= 3 && !comparisonList.includes(offer.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
