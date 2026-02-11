import { memo } from 'react';
import type { WeatherStation } from '../../models/WeatherStation';

interface Props {
  station: WeatherStation;
  selected: boolean;
  disabled: boolean;
  onToggle: (stationId: string) => void;
}

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
          backgroundColor: selected ? 'rgba(41, 94, 179, 0.32)' : '#111827',
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
              color: '#e5e7eb'
            }}
          >
            <strong style={{ color: '#f8fafc' }}>{station.name}</strong>
            <br />
            <small style={{ color: '#94a3b8' }}>{station.id}</small>
          </label>
        </div>
      </div>
    </div>
  );
};

// React.memo verhindert unnötige Re-Renders wenn Props unverändert sind
export const StationCard = memo(StationCardComponent);
