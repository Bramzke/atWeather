import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './components/pages/Home';

// Lazy Loading für die Weather-Route:
// Das Bundle der Weather-Seite wird erst beim ersten Aufruf geladen,
// was die initiale Ladezeit der App deutlich reduziert.
const Weather = lazy(() =>
  import('./components/pages/Weather').then(m => ({ default: m.Weather }))
);

function App() {
  return (
    // HashRouter ist notwendig für GitHub Pages, da dort kein Server-seitiges
    // Routing verfügbar ist. Die Raute (#) im URL trennt den Basispfad
    // vom App-internen Routing.
    <HashRouter>
      <Routes>
        {/* Layout-Route: Navbar + Outlet für alle Unterseiten */}
        <Route element={<Layout />}>
          {/* Startseite: Stationsauswahl */}
          <Route path="/" element={<Home />} />

          {/* Wetterseite: Diagrammdarstellung der gewählten Stationen.
              Suspense zeigt einen Ladeindikator während das Lazy-Bundle geladen wird. */}
          <Route
            path="/weather"
            element={
              <Suspense fallback={
                <div className="container text-center mt-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Lädt...</span>
                  </div>
                </div>
              }>
                <Weather />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
