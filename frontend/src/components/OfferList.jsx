//! Scopo:
// Mappare l'array di offerte per visualizzare gli elementi.

//* Logica:

// 1. Definisco lo stato per i filtri di input (Titolo)
// 2. Definisco lo stato per il filtro di selezione (Categoria)
// 3. Utilizzo l'hook per recuperare i dati, passando i filtri di base
// 4. Implemento un filtro lato client sull'array 'offers' completo.
// 5. Input per la ricerca per titolo (passato all'API di lista)
// 6. Select per la categoria (passata all'API di lista)
// 7. Mostro il caricamento
// 8. Messaggio se non ci sono risultati
// 9. Mappo l'array di offerte COMPLETE
// 10. Uso i campi 'partial'
// 11. Uso i campi 'full' recuperati con la seconda fetch

import OfferListItem from "./OfferListItem";

export default function OfferList({
  offers,
  searchTerm,
  favoriteIds,
  toggleFavorite,
  comparisonList,
  toggleComparison,
}) {
  // Calcoliamo qui la logica di disabilitazione per evitare di ripeterla nel loop
  const isComparisonDisabled = comparisonList.length >= 3;

  return (
    // Contenitore della griglia: 'row' per la griglia, 'g-4' per lo spazio tra le card
    <div className="row g-4">
      {offers.map((offer) => (
        // Ogni OfferListItem deve essere avvolto in una colonna (col)
        // Col-12 (100%) su mobile, Col-md-6 (50%) su tablet, Col-lg-4 (33.3%) su desktop
        <div key={offer.id} className="col-12 col-md-6 col-lg-4">
          <OfferListItem
            offer={offer}
            searchTerm={searchTerm}
            toggleFavorite={toggleFavorite}
            toggleComparison={toggleComparison}
            // Passaggio dello stato calcolato
            isFavorite={favoriteIds.includes(offer.id)}
            isCompared={comparisonList.includes(offer.id)}
            // Logica di disabilitazione
            isComparisonDisabled={isComparisonDisabled && !comparisonList.includes(offer.id)}
          />
        </div>
      ))}
    </div>
  );
}
