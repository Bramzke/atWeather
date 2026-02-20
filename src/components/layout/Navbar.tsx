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
 */
export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass mb-2">
      <div className="container-fluid">

        {/* Brand-Link: führt zur Startseite */}
        <Link className="navbar-brand" to="/">WeatherChart</Link>

        {/* Hamburger-Button für mobile Ansicht (Bootstrap-Collapse) */}
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

        <div className="collapse navbar-collapse" id="navbarNav">

          {/* Linke Navigation: App-interne Links */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
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
