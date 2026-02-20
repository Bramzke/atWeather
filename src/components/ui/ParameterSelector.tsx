interface Props {
  temperature: boolean; // Temperatur (TL) ausgewählt
  humidity: boolean;    // Luftfeuchtigkeit (RF) ausgewählt
  rainfall: boolean;    // Niederschlag (RR) ausgewählt
  sunshine: boolean;    // Sonnenschein (SO) ausgewählt
  onChange: (param: string, value: boolean) => void; // Callback bei Änderung
}

/**
 * ParameterSelector-Komponente: Checkbox-Gruppe zur Auswahl der Wetterparameter.
 *
 * Wird auf der Weather-Seite angezeigt und steuert welche Messwerte
 * von der GeoSphere API abgefragt und im Diagramm dargestellt werden.
 *
 * Verfügbare Parameter:
 * - Temperatur   → API: TL (Lufttemperatur in °C)
 * - Luftfeuchtigkeit → API: RF (Relative Feuchte in %)
 * - Niederschlag → API: RR (Niederschlag in mm)
 * - Sonnenschein → API: SO (Sonnenscheindauer in min)
 */
export const ParameterSelector = ({ temperature, humidity, rainfall, sunshine, onChange }: Props) => {
  return (
    <div className="mb-3">
      <label className="form-label">Parameter:</label>

      {/* Temperatur */}
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="param-temp"
          checked={temperature}
          onChange={(e) => onChange('temperature', e.target.checked)}
        />
        <label className="form-check-label" htmlFor="param-temp">Temperatur</label>
      </div>

      {/* Luftfeuchtigkeit */}
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="param-humid"
          checked={humidity}
          onChange={(e) => onChange('humidity', e.target.checked)}
        />
        <label className="form-check-label" htmlFor="param-humid">rel. Luftfeuchte</label>
      </div>

      {/* Niederschlag */}
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="param-rain"
          checked={rainfall}
          onChange={(e) => onChange('rainfall', e.target.checked)}
        />
        <label className="form-check-label" htmlFor="param-rain">Niederschlag</label>
      </div>

      {/* Sonnenschein */}
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="param-sun"
          checked={sunshine}
          onChange={(e) => onChange('sunshine', e.target.checked)}
        />
        <label className="form-check-label" htmlFor="param-sun">Sonnenschein</label>
      </div>
    </div>
  );
};
