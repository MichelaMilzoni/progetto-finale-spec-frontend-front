//! Scopo:
// Agire da Controller e assemblatore dell'interfaccia.
// È l'unica entità che interagisce direttamente con la logica di stato (useOffers)

//* 1. Hook Call
// Devo importare e chiamare la funzione useOffers() qui, all'interno del componente funzionale

//* 2. Recupero Stato
// Devo destrutturare tutti i valori di ritorno dall'hook:
// offers (già filtrate), isLoading, error, filters, updateFilters
// e availableCategories, availableDestinations, availableOrigins.

//* 3. Gestione Caricamento/Errore
// Devo usare istruzioni condizionali (if) per renderizzare: un messaggio di "Caricamento..." se isLoading è true,
// oppure un messaggio di "Errore..." se lo stato error contiene un valore

//* 4. Rendering Condizionale
// Se non ci sono errori e il caricamento è finito,
// renderizzo l'intestazione, il componente OfferFilter e il componente OfferList.

//* 5. Prop Drilling
// Devo passare le proprietà rilevanti (filters, updateFilters, categories, origin, destination )
// al componente filtro(OfferFilter) e l'array offers al componente lista(offerList).

import React from "react";
import useOffers from "../hooks/useOffers"; //* 1
import OfferFilter from "../components/OfferFilter";
import OfferList from "../components/OfferList";
import ComparisonBar from "../components/ComparisonBar";
import OfferListItem from "../components/OfferListItem";

export default function OfferListPage() {
  //* 2
  const {
    offers,
    allOffers,
    isLoading,
    error,
    filters,
    updateFilters,
    availableCategories,
    availableOrigins,
    availableDestinations,
    favoriteIds,
    toggleFavorite,
    comparisonList,
    toggleComparison,
  } = useOffers();

  //* 3
  // Gestione Caricamento e Errore
  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 alert alert-danger">
        Errore nel caricamento delle offerte: {error}
      </div>
    );
  }

  return (
    // Contenitore principale con margine superiore (dovrebbe essere dentro il tag <main> in App.jsx)
    <div className="container py-4 mt-4">
      <h1 className="mb-4 text-center text-primary">Catalogo Offerte Trasporto Merci</h1>

      {/* 1. Filtri e Ordinamento */}
      <OfferFilter
        currentFilters={filters}
        onFilterChange={updateFilters}
        categories={availableCategories}
        availableOrigins={availableOrigins}
        availableDestinations={availableDestinations}
      />

      {/* 2. Conteggio Risultati */}
      <h2 className="fs-5 mt-4 mb-3 text-secondary">
        Risultati: <span className="badge bg-primary">{offers.length}</span> offerte trovate
      </h2>

      {/* 3. Lista Offerte */}
      {offers.length > 0 ? (
        // ✅ IMPORTANTE: Se usi un componente OfferList, assicurati che contenga le classi row
        <OfferList
          offers={offers}
          favoriteIds={favoriteIds}
          toggleFavorite={toggleFavorite}
          comparisonList={comparisonList}
          toggleComparison={toggleComparison}
          // Passa il termine di ricerca per l'highlighting
          searchTerm={filters.search}
        />
      ) : (
        <div className="alert alert-info text-center" role="alert">
          Nessuna offerta trovata con i filtri selezionati. Prova a resettare i filtri!
        </div>
      )}

      {/* 4. Comparison Bar (Se è un componente fisso in fondo allo schermo) */}
      <ComparisonBar
        offers={allOffers}
        comparisonList={comparisonList}
        toggleComparison={toggleComparison}
      />
    </div>
  );
}
