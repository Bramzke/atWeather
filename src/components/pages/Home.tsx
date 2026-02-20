import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StationCard } from '../ui/StationCard';
import { AUSTRIAN_STATES } from '../../models/WeatherStation';
import { getStationsByState } from '../../data/stations';

/**
 * Home-Seite: Stationsauswahl.
 *
 * Zeigt alle österreichischen Wetterstationen gruppiert nach Bundesland.
 * Der Benutzer kann bis zu 5 Stationen auswählen und anschließend
 * zur Wetterdarstellung navigieren.
 *
 * Routing: Nach der Auswahl wird zur Route /weather?id=...&id=... navigiert,
 * wobei jede Stations-ID als eigener Query-Parameter übergeben wird.
 */
export const Home = () => {
  // Menge der aktuell ausgewählten Stations-IDs (max. 5)
  const [selectedStations, setSelectedStations] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  /**
   * Schaltet eine Station zwischen ausgewählt/abgewählt um.
   * Ist das Maximum von 5 Stationen bereits erreicht, wird keine weitere hinzugefügt.
   */
  const toggleStation = (stationId: string) => {
    setSelectedStations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stationId)) {
        // Station abwählen
        newSet.delete(stationId);
      } else if (newSet.size < 5) {
        // Station hinzufügen (nur wenn Limit nicht erreicht)
        newSet.add(stationId);
      }
      return newSet;
    });
  };

  /**
   * Navigiert zur Wetterseite mit den ausgewählten Stations-IDs als Query-Parameter.
   * Beispiel-URL: /weather?id=11019&id=11018
   */
  const navigateToWeather = () => {
    if (selectedStations.size > 0) {
      const queryString = Array.from(selectedStations)
        .map(id => `id=${id}`)
        .join('&');
      navigate(`/weather?${queryString}`);
    }
  };

  return (
    <div className="container mt-4">

      {/* Sticky-Banner mit Anzahl gewählter Stationen und Navigationsbutton.
          Wird nur angezeigt, wenn mindestens eine Station ausgewählt ist. */}
      {selectedStations.size > 0 && (
        <div className="alert alert-info mb-4 sticky-top" style={{ top: 0, zIndex: 1020 }}>
          <div className="d-flex justify-content-between align-items-center">
            <strong>Ausgewählte Stationen ({selectedStations.size}/5)</strong>
            <button className="btn btn-primary" onClick={navigateToWeather}>
              Temperaturverläufe anzeigen
            </button>
          </div>
        </div>
      )}

      {/* Stationsliste gruppiert nach Bundesland.
          AUSTRIAN_STATES definiert die feste Reihenfolge der Bundesländer. */}
      {AUSTRIAN_STATES.map(state => (
        <div key={state} className="card mb-4">
          <div className="card-header">
            <h2 className="h5 mb-0">{state}</h2>
          </div>
          <div className="card-body">
            {/* Responsive Grid: 1 bis 5 Spalten je nach Bildschirmbreite */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-4">
              {getStationsByState(state).map(station => (
                <StationCard
                  key={station.id}
                  station={station}
                  selected={selectedStations.has(station.id)}
                  // Deaktiviert wenn Maximum (5) erreicht und Station nicht bereits gewählt
                  disabled={!selectedStations.has(station.id) && selectedStations.size >= 5}
                  onToggle={toggleStation}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
