import React from "react";
import { Link } from "react-router-dom";
import { useOffersContext } from "../context/OffersContext";

export default function NavBar() {
  // Accesso ai contatori tramite Context
  const { comparisonList, favoriteIds } = useOffersContext();

  return (
    // Navbar fissa in alto, sfondo primario (blu), testo chiaro
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
      <div className="container">
        {/* Logo a Sinistra (Brand) */}
        <Link to="/" className="navbar-brand fs-4 fw-bold">
          Transport Hub
        </Link>

        {/* Toggler per la responsività su mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenitore dei link, allineato a destra (ms-auto) */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* 1. Catalogo (Home) */}
            <li className="nav-item">
              <Link to="/" className="nav-link active" aria-current="page">
                Catalogo
              </Link>
            </li>

            {/* 2. Preferiti */}
            <li className="nav-item">
              {/* position-relative per posizionare il badge */}
              <Link to="/favorites" className="nav-link position-relative">
                Preferiti
                {/* Badge rosso (bg-danger) nell'angolo in alto a destra */}
                {favoriteIds.length > 0 && (
                  <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
                    {favoriteIds.length}
                  </span>
                )}
              </Link>
            </li>

            {/* 3. Confronto */}
            <li className="nav-item">
              <Link to="/compare" className="nav-link position-relative">
                Confronta
                {/* Badge giallo (bg-warning) per il confronto */}
                {comparisonList.length > 0 && (
                  <span className="badge rounded-pill bg-warning text-dark position-absolute top-0 start-100 translate-middle">
                    {comparisonList.length}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
