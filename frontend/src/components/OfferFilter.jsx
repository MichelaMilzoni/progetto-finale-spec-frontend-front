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
    <div className="filters-container">
      {/* 1. Filtro Ricerca Testuale */}
      <input
        type="text"
        name="search"
        placeholder="Cerca parola chiave..."
        value={currentFilters.search}
        onChange={handleChange}
      />
      {/* 2. Filtro Categoria */}
      <select name="category" value={currentFilters.category} onChange={handleChange}>
        <option value="">Tutte le Categorie</option> {/* Reset */}
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      {/* 3. Filtro Origine (Tratta) */}
      <select name="origin" value={currentFilters.origin} onChange={handleChange}>
        <option value="">Tutte le Partenze</option> {/* Reset */}
        {availableOrigins.map(
          (
            origin // CORRETTO: Uso availableOrigins
          ) => (
            <option key={origin} value={origin}>
              {origin}
            </option>
          )
        )}
      </select>
      {/* 4. Filtro Destinazione (Tratta) */}
      <select name="destination" value={currentFilters.destination} onChange={handleChange}>
        <option value="">Tutte le Destinazioni</option> {/* Reset */}
        {availableDestinations.map(
          (
            destination // CORRETTO: Uso availableDestinations
          ) => (
            <option key={destination} value={destination}>
              {destination}
            </option>
          )
        )}
      </select>
    </div>
  );
}
