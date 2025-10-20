import React from "react";

export default function Footer() {
  return (
    // Footer con margine superiore, sfondo grigio chiaro (bg-light), bordo superiore
    <footer className="footer mt-auto py-3 bg-light border-top">
      <div className="container text-center">
        <span className="text-muted small">
          © {new Date().getFullYear()} Transport Hub S.r.l. &reg; |
          <a href="/privacy" className="text-decoration-none text-muted mx-2">
            Privacy Policy
          </a>{" "}
          | Tutti i diritti riservati.
        </span>
      </div>
    </footer>
  );
}
