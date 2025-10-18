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

  return (
    <ul>
      {offers.map((offer) => (
        <OfferListItem
          key={offer.id}
          offer={offer}
          searchTerm={searchTerm} // Lo passo all'Item
          toggleFavorite={toggleFavorite}
          toggleComparison={toggleComparison} // Il tuo OfferListItem usa favoriteIds e comparisonList direttamente,
          // quindi li passiamo.
          favoriteIds={favoriteIds}
          comparisonList={comparisonList}
        />
      ))}
    </ul>
  );
}
