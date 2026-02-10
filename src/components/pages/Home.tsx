import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StationCard } from '../ui/StationCard';
import { AUSTRIAN_STATES } from '../../models/WeatherStation';
import { getStationsByState } from '../../data/stations';

export const Home = () => {
  const [selectedStations, setSelectedStations] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleStation = (stationId: string) => {
    setSelectedStations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stationId)) {
        newSet.delete(stationId);
      } else if (newSet.size < 5) {
        newSet.add(stationId);
      }
      return newSet;
    });
  };

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

      {AUSTRIAN_STATES.map(state => (
        <div key={state} className="card mb-4">
          <div className="card-header">
            <h2 className="h5 mb-0">{state}</h2>
          </div>
          <div className="card-body">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {getStationsByState(state).map(station => (
                <StationCard
                  key={station.id}
                  station={station}
                  selected={selectedStations.has(station.id)}
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
