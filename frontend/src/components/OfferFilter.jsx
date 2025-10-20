//! Scopo:
// Fornire l'interfaccia utente per modificare i filtri e comunicare tali modifiche al Custom Hook

//* Prop Ricevute -	Descrizione
// currentFilters - L'oggetto filtro completo ({ search, category, origin, destination }) per popolare i valori degli input.
// onFilterChange - La funzione updateFilters dall'hook, utilizzata per inviare nuove modifiche al filtro.
// categories - L'array delle categorie uniche disponibili (per popolare la <select>)

//* Logica:
// 1. Devo definire una funzione (es. handleChange)
// 1.1 che si attiva sull'evento onChange di ogni elemento di input.
// 2. Questa funzione deve leggere il name e il value dell'elemento che ha scatenato l'evento.
// 3. Utilizzo la prop onFilterChange per inviare un oggetto { [name]: value } al custom hook,
//    assicurando che venga aggiornato solo il filtro specifico.
// 4. Devo creare input per: search, origin e destination (input testuali).
// 5. Devo creare un menu a tendina (<select>) per category, origin e destination mappando l'array categories ricevuto

import React from "react";

export default function OfferFilter({
  currentFilters,
  onFilterChange,
  categories,
  availableOrigins,
  availableDestinations,
}) {
  // 1.
  const handleChange = (e) => {
    // 2.
    const { name, value } = e.target;
    // 3.
    onFilterChange({ [name]: value });
  };

  return (
    <>
      <div className="p-3 my-4 shadow-sm bg-light rounded">
        <h5 className="mb-3 text-primary">Filtri e Ordinamento Offerte</h5>

        {/* Sezione Filtri (Search e Selects) */}
        <div className="row g-3 align-items-end mb-4">
          {/* 1. Filtro Ricerca Testuale */}
          <div className="col-lg-3 col-md-6 col-sm-12">
            <label htmlFor="search" className="form-label visually-hidden">
              Cerca parola chiave
            </label>
            <input
              type="text"
              name="search"
              className="form-control" // Classe Bootstrap per input
              placeholder="Cerca parola chiave..."
              value={currentFilters.search}
              onChange={handleChange}
            />
          </div>

          {/* 2. Filtro Categoria */}
          <div className="col-lg-2 col-md-6 col-sm-6">
            <label htmlFor="category" className="form-label small text-muted">
              Categoria
            </label>
            <select
              name="category"
              className="form-select" // Classe Bootstrap per select
              value={currentFilters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
            >
              <option value="">Tutte le Categorie</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Filtro Origine (Tratta) */}
          <div className="col-lg-2 col-md-6 col-sm-6">
            <label htmlFor="origin" className="form-label small text-muted">
              Partenza
            </label>
            <select
              name="origin"
              className="form-select"
              value={currentFilters.origin}
              onChange={handleChange}
            >
              <option value="">Tutte le Partenze</option>
              {availableOrigins.map((origin) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Filtro Destinazione (Tratta) */}
          <div className="col-lg-2 col-md-6 col-sm-12">
            <label htmlFor="destination" className="form-label small text-muted">
              Destinazione
            </label>
            <select
              name="destination"
              className="form-select"
              value={currentFilters.destination}
              onChange={handleChange}
            >
              <option value="">Tutte le Destinazioni</option>
              {availableDestinations.map((destination) => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr className="my-3" />

        {/* Sezione Ordinamento */}
        <div className="row g-3 align-items-end">
          {/* 5. Criterio di Ordinamento (sortBy) */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <label htmlFor="sortBy" className="form-label small text-muted">
              Ordina per:
            </label>
            <select
              name="sortBy"
              className="form-select"
              value={currentFilters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            >
              <option value="title">Titolo Offerta</option>
              <option value="category">Categoria</option>
            </select>
          </div>

          {/* 6. Direzione di Ordinamento (sortOrder) */}
          <div className="col-lg-2 col-md-6 col-sm-6">
            <label htmlFor="sortOrder" className="form-label small text-muted">
              Direzione:
            </label>
            <select
              name="sortOrder"
              className="form-select"
              value={currentFilters.sortOrder}
              onChange={(e) => onFilterChange({ sortOrder: e.target.value })}
            >
              <option value="asc">Ascendente (A-Z)</option>
              <option value="desc">Discendente (Z-A)</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
