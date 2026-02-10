interface Props {
  temperature: boolean;
  humidity: boolean;
  rainfall: boolean;
  sunshine: boolean;
  onChange: (param: string, value: boolean) => void;
}

export const ParameterSelector = ({ temperature, humidity, rainfall, sunshine, onChange }: Props) => {
  return (
    <div className="mb-3">
      <label className="form-label">Parameter:</label>
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
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="param-humid"
          checked={humidity}
          onChange={(e) => onChange('humidity', e.target.checked)}
        />
        <label className="form-check-label" htmlFor="param-humid">Luftfeuchtigkeit</label>
      </div>
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
