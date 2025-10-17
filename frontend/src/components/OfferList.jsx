//! Scopo:
// Mappare l'array di offerte per visualizzare gli elementi.

//* Logica:

// 1. Ricevo l'array offers tramite props.
// 2. Utilizzo il metodo .map() sull'array.
// 3. Per ogni offerta, rendo il componente OfferListItem.
// 4. Fondamentale: Passo l'oggetto singola offerta come prop (offer={...}) al componente figlio.
// 5. Devo assegnare l'ID dell'offerta come key React all'elemento mappato.

import OfferListItem from "./OfferListItem";

//* 1
export default function OfferList({ offers }) {
  //* 2 + 3 + 4 + 5
  return (
    <ul>
      {offers.map((offer) => (
        <OfferListItem key={offer.id} offer={offer} />
      ))}
    </ul>
  );
}
