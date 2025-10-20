import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { OffersProvider } from "./context/OffersContext";

// Importa i nuovi componenti
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import OfferListPage from "./pages/OfferListPage";
import OfferDetailPage from "./pages/OfferDetailPage";
import ComparisonPage from "./pages/ComparisonPage";
import FavoriteOffersPage from "./pages/FavoriteOffersPage";

//* --- CONFIGURAZIONE GLOBALE & TIPI ---
// progetto solo js e non js+typescript (quindi replico i dati contenuti nei file .ts del backend)
// Le categorie devono essere coerenti con schema.ts
const SERVICE_CATEGORIES = ["FTL Standard", "LTL Standard", "Espresso Dedicato", "Carichi Pesanti"];

// Tipo simulato per il frontend (coerente con CompanyOffer dal backend)
// In un ambiente reale userei 'export type CompanyOffer...' dal file types.ts
const initialOfferState = {
  title: "",
  category: SERVICE_CATEGORIES[0],
  basePriceKm: 1.2,
  maxPayloadKg: 30000,
  baseTimeDays: 2,
  multiStopCostPct: 0.03,
  satCostPct: 0.05,
  videoCostPct: 0.05,
  insuranceIncludedEuro: 500,
  isEcoFriendly: false,
  fleetAvailabilityPct: 0.95,
  description: "",
};

function App() {
  // L'unico compito di App è presentare la pagina principale dell'applicazione.
  return (
    // 1. Contenitore App: Flexbox verticale, altezza minima 100% della viewport
    <div className="App d-flex flex-column min-vh-100">
      <OffersProvider>
        <Router>
          <NavBar />

          {/* 2. Contenitore Principale: Si espande per riempire lo spazio */}
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<OfferListPage />} />
              <Route path="/offers/:offerId" element={<OfferDetailPage />} />
              <Route path="/compare" element={<ComparisonPage />} />
              <Route path="/favorites" element={<FavoriteOffersPage />} />
            </Routes>
          </main>

          {/* 3. FOOTER */}
          <Footer />
        </Router>
      </OffersProvider>
    </div>
  );
}

export default App;
