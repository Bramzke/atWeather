import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HouseIcon, ArrowUpRightIcon } from '../ui/Icons';

/**
 * Navigationsleiste der Anwendung.
 *
 * Enthält:
 * - App-Logo/Brand-Link zur Startseite
 * - Interner Link zur Stationsauswahl (Home)
 * - Externe Links zu GeoSphere API, GeoSphere Wettervorhersage und Ventusky
 *
 * Verwendet Bootstrap-Glass-Effekt (.navbar-glass) für ein transparentes,
 * verschwommenes Erscheinungsbild. Kollabierbar auf kleinen Bildschirmen.
 *
 * Der Collapse-State wird per React-State gesteuert (kein Bootstrap JS nötig),
 * da Bootstrap JS in React-Projekten zu Konflikten führen kann.
 */
export const Navbar = () => {
  // Steuert ob das Menü in der mobilen Ansicht aufgeklappt ist
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass mb-2">
      <div className="container-fluid">

        {/* Brand-Link: führt zur Startseite */}
        <Link className="navbar-brand" to="/">WeatherChart</Link>

        {/* Hamburger-Button für mobile Ansicht: toggelt isOpen per React-State */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menüinhalt: Bootstrap-Klassen für Animation + show wenn isOpen */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">

          {/* Linke Navigation: App-interne Links */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>
                <HouseIcon /> Stationen
              </Link>
            </li>
          </ul>

          {/* Rechte Navigation: Externe Ressourcen-Links */}
          <ul className="navbar-nav ms-auto d-flex gap-3">
            <li className="nav-item">
              {/* Link zur GeoSphere API-Dokumentation */}
              <a
                className="nav-link"
                href="https://dataset.api.hub.geosphere.at/app/frontend/station/historical/tawes-v1-10min"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowUpRightIcon /> GeoSphere API
              </a>
            </li>
            <li className="nav-item">
              {/* Link zur offiziellen GeoSphere Wettervorhersage */}
              <a
                className="nav-link"
                href="https://www.geosphere.at/de"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowUpRightIcon /> GeoSphere Wettervorhersage
              </a>
            </li>
            <li className="nav-item">
              {/* Link zu Ventusky: Interaktive Wetterkarte, voreingestellt auf Österreich */}
              <a
                className="nav-link"
                href="https://www.ventusky.com/de#p=47.65;13.20;7"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowUpRightIcon /> Ventusky.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
