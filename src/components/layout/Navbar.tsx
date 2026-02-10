import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass mb-2">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">WeatherChart</Link>
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
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house-door-fill"></i> Stationen
              </Link>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="https://dataset.api.hub.geosphere.at"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-box-arrow-up-right"></i> GeoSphere API
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
