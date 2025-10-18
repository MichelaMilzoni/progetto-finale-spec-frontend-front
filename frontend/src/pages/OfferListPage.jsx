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
  if (isLoading) {
    return (
      <div className="container">
        <h2>Caricamento Offerte...</h2>
        <p>Attendere, stiamo recuperando i dati dal server.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container error">
        <h2>Errore di Caricamento</h2>
        <p>Si è verificato un errore: {error}</p>
        <p>Riprova più tardi.</p>
      </div>
    );
  }

  //* 4
  return (
    <div className="offer-page-layout">
      <h1>Catalogo Offerte Trasporto Merci</h1>

      {/* Passo i filtri e la funzione di aggiornamento al componente Filtri */}
      <OfferFilter
        currentFilters={filters} //* 5
        onFilterChange={updateFilters} //* 5
        categories={availableCategories} //* 5
        availableOrigins={availableOrigins} //* 5
        availableDestinations={availableDestinations} //* 5
      />

      <h2>Risultati ({offers.length} offerte trovate)</h2>

      {/* Passo l'array di offerte filtrate al componente Lista */}
      {offers.length > 0 ? (
        <OfferList
          offers={offers}
          favoriteIds={favoriteIds}
          toggleFavorite={toggleFavorite}
          comparisonList={comparisonList}
          toggleComparison={toggleComparison}
        />
      ) : (
        <p>Nessuna offerta trovata con i filtri selezionati.</p>
      )}

      <ComparisonBar
        offers={offers} // L'array di offerte filtrate correnti
        comparisonList={comparisonList}
        toggleComparison={toggleComparison}
      />
    </div>
  );
}
