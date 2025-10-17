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

export default function OfferListItem({ offer }) {
  const { title, origin, destination, category, basePriceKm, description } = offer;

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
            <strong>Prezzo base/km:</strong> €{basePriceKm.toFixed(2)}
          </p>
          <p>
            <strong>Descrizione:</strong> {description}
          </p>
        </section>
      </div>

      <div className="card-actions">
        <button className="wishlist-button">Salva nei preferiti</button>
        <button className="details-button">Dettagli / Confronta</button>
      </div>
    </div>
  );
}
