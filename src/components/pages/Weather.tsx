import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { de } from 'date-fns/locale';
import { WeatherChart } from '../chart/WeatherChart';
import { ParameterSelector } from '../ui/ParameterSelector';
import { WeatherApiService } from '../../services/weatherApiService';
import type { WeatherResponse } from '../../models/WeatherResponse';
import type { ParameterSelection } from '../../models/ChartTypes';
import { getStationById } from '../../data/stations';
import { roundToTenMinutes } from '../../utils/dateUtils';
import { useScaleSynchronization } from '../../hooks/useScaleSynchronization';

export const Weather = () => {
  const [searchParams] = useSearchParams();
  const stationIds = searchParams.getAll('id');

  // Standard: Letzte 7 Tage
  const defaultEnd = roundToTenMinutes(new Date());
  const defaultStart = roundToTenMinutes(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  const [startDate, setStartDate] = useState<Date>(defaultStart);
  const [endDate, setEndDate] = useState<Date>(defaultEnd);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedParams, setSelectedParams] = useState<ParameterSelection>({
    temperature: true,
    humidity: false,
    rainfall: false,
    sunshine: false
  });
  const [syncScales, setSyncScales] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const syncedScales = useScaleSynchronization(weatherData, selectedParams, syncScales);

  const handleParamChange = (param: string, value: boolean) => {
    setSelectedParams(prev => ({ ...prev, [param]: value }));
  };

  const loadData = async () => {
    if (stationIds.length === 0) {
      setErrorMessage('');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Parameter-String erstellen (wie im Blazor: "TL,RF,RR,SO")
      const params: string[] = [];
      if (selectedParams.temperature) params.push('TL');
      if (selectedParams.humidity) params.push('RF');
      if (selectedParams.rainfall) params.push('RR');
      if (selectedParams.sunshine) params.push('SO');

      if (params.length === 0) {
        setErrorMessage('Bitte mindestens einen Parameter auswählen');
        setIsLoading(false);
        return;
      }

      const data = await WeatherApiService.getWeatherData({
        stationIds,
        start: startDate,
        end: endDate,
        parameters: params.join(',')
      });

      setWeatherData(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Fehler beim Laden der Daten');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // Only run once when the page is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={isFullscreen ? 'container-fluid' : 'container'}>
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-start">
            <div className="col-12 col-lg-3">
              <label className="form-label">Von:</label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => date && setStartDate(roundToTenMinutes(date))}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={10}
                dateFormat="dd.MM.yyyy HH:mm"
                locale={de}
                className="form-control"
                placeholderText="dd.MM.yyyy HH:mm"
                maxDate={endDate}
              />
            </div>
            <div className="col-12 col-lg-3">
              <label className="form-label">Bis:</label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => date && setEndDate(roundToTenMinutes(date))}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={10}
                dateFormat="dd.MM.yyyy HH:mm"
                locale={de}
                className="form-control"
                placeholderText="dd.MM.yyyy HH:mm"
                minDate={startDate}
              />
            </div>
            <div className="col-12 col-lg-3">
              <ParameterSelector
                {...selectedParams}
                onChange={handleParamChange}
              />
            </div>
            <div className="col-12 col-lg-3">
              <div className="mb-3 mb-lg-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sync-scales"
                    checked={syncScales}
                    onChange={(e) => setSyncScales(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="sync-scales">
                    Skalen angleichen
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="fullscreen"
                    checked={isFullscreen}
                    onChange={(e) => setIsFullscreen(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="fullscreen">
                    <i className="bi bi-arrows-fullscreen"></i> Vollbild
                  </label>
                </div>
              </div>

              <div className="d-grid d-lg-block">
                <button
                  className="btn btn-primary"
                  onClick={loadData}
                  disabled={isLoading || stationIds.length === 0}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Lade Daten...
                    </>
                  ) : (
                    'Daten laden'
                  )}
                </button>
              </div>
            </div>
          </div>

          {stationIds.length === 0 && (
            <div className="alert alert-warning mt-3">
              Bitte wählen Sie zuerst Wetterstationen auf der <a href="/">Startseite</a> aus.
            </div>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}

      {weatherData?.features
        .sort((a, b) => {
          const indexA = stationIds.indexOf(a.properties.station);
          const indexB = stationIds.indexOf(b.properties.station);
          return indexA - indexB;
        })
        .map(feature => {
          const station = getStationById(feature.properties.station);
          return (
            <div key={station.id} className="card mb-4">
              <div className="card-header">
                <h3 className="h5 mb-0 text-center">{station.name}</h3>
              </div>
              <div className="card-body">
                <WeatherChart
                  feature={feature}
                  timestamps={weatherData.timestamps}
                  selectedParams={selectedParams}
                  syncedScales={syncedScales}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};
