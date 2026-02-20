import { memo } from 'react';
import type { WeatherStation } from '../../models/WeatherStation';

interface Props {
  station: WeatherStation;             // Stationsdaten (ID, Name, Bundesland)
  selected: boolean;                   // Ob die Station aktuell ausgewählt ist
  disabled: boolean;                   // Ob die Station deaktiviert ist (Maximum erreicht)
  onToggle: (stationId: string) => void; // Callback beim An-/Abwählen
}

/**
 * StationCard-Komponente: Auswahlkarte für eine einzelne Wetterstation.
 *
 * Zeigt Stationsname und ID als Checkbox-Element an.
 * Ausgewählte Stationen werden mit blauer Umrandung und leichtem blauen Hintergrund hervorgehoben.
 * Ist das Maximum von 5 gleichzeitig ausgewählten Stationen erreicht,
 * werden nicht ausgewählte Karten deaktiviert und ausgegraut.
 *
 * Umwickelt mit React.memo, da die Liste sehr viele Einträge enthält (400+ Stationen)
 * und unnötige Re-Renders den Browser merklich verlangsamen würden.
 */
const StationCardComponent = ({ station, selected, disabled, onToggle }: Props) => {
  return (
    <div className="col">
      <div
        className={`station-card ${selected ? 'selected' : ''}`}
        style={{
          border: '1px solid rgba(148, 163, 184, 0.35)',
          borderRadius: '0.9rem',
          transition: 'all 0.2s ease-in-out',
          padding: '1rem',
          // Ausgewählt: blauer Hintergrund; Standard: dunkles Grau
          backgroundColor: selected ? 'rgba(41, 94, 179, 0.32)' : '#111827',
          // Ausgewählt: blaue Umrandung mit 2px; Standard: subtile graue Linie
          borderColor: selected ? 'rgba(79, 156, 255, 0.75)' : 'rgba(148, 163, 184, 0.35)',
          borderWidth: selected ? '2px' : '1px',
          color: '#e5e7eb'
        }}
      >
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={`station-${station.id}`}
            checked={selected}
            disabled={disabled}
            onChange={() => onToggle(station.id)}
            style={{
              width: '1.5em',
              height: '1.5em',
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          />
          <label
            className="form-check-label"
            htmlFor={`station-${station.id}`}
            style={{
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: '#e5e7eb',
              marginLeft: '0.6rem'
            }}
          >
            {/* Stationsname prominent, ID als kleinerer Hinweistext */}
            <strong style={{ color: '#f8fafc' }}>{station.name}</strong>
            <br />
            <small style={{ color: '#94a3b8' }}>{station.id}</small>
          </label>
        </div>
      </div>
    </div>
  );
};

// React.memo: verhindert unnötige Re-Renders wenn Props unverändert sind
export const StationCard = memo(StationCardComponent);
