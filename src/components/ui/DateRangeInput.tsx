interface Props {
  startDate: string;
  endDate: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
}

export const DateRangeInput = ({ startDate, endDate, onStartChange, onEndChange }: Props) => {
  return (
    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Von:</label>
        <input
          type="text"
          className="form-control"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          placeholder="dd.MM.yyyy HH:mm"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Bis:</label>
        <input
          type="text"
          className="form-control"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          placeholder="dd.MM.yyyy HH:mm"
        />
      </div>
    </div>
  );
};
