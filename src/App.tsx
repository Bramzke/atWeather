import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './components/pages/Home';

// Lazy Loading für Weather-Route (reduziert Initial Bundle)
const Weather = lazy(() =>
  import('./components/pages/Weather').then(m => ({ default: m.Weather }))
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
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
    </BrowserRouter>
  );
}

export default App;
