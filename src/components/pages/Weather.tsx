import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { de } from 'date-fns/locale';
import { WeatherChart } from '../chart/WeatherChart';
import { ParameterSelector } from '../ui/ParameterSelector';
import { FullscreenIcon } from '../ui/Icons';
import { WeatherApiService } from '../../services/weatherApiService';
import type { WeatherResponse } from '../../models/WeatherResponse';
import type { ParameterSelection } from '../../models/ChartTypes';
import { getStationById } from '../../data/stations';
import { roundToTenMinutes } from '../../utils/dateUtils';
import { useScaleSynchronization } from '../../hooks/useScaleSynchronization';
import { useInterpolatedData } from '../../hooks/useInterpolatedData';

/**
 * Weather-Seite: Diagrammdarstellung der Wetterdaten.
 *
 * Liest die Stations-IDs aus den URL-Query-Parametern (?id=...&id=...),
 * lädt die historischen Messdaten von der GeoSphere API und zeigt
 * für jede Station ein eigenes ECharts-Diagramm an.
 *
 * Funktionen:
 * - Datumsbereich wählen (Datepicker, 10-Minuten-Raster der API)
 * - Parameter auswählen (Temperatur, Luftfeuchtigkeit, Niederschlag, Sonnenschein)
 * - Skalensynchronisierung: gleiche Y-Achsen-Grenzen über alle Stationen
 * - Vollbild-Modus (container-fluid statt container)
 */
export const Weather = () => {
  // Stations-IDs aus dem URL-Query-String lesen (mehrere ?id=... Parameter möglich)
  const [searchParams] = useSearchParams();
  const stationIds = searchParams.getAll('id');

  // Standardzeitraum: letzte 7 Tage, auf 10 Minuten abgerundet (API-Auflösung)
  const defaultEnd = roundToTenMinutes(new Date());
  const defaultStart = roundToTenMinutes(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  // --- Zustandsvariablen ---
  const [startDate, setStartDate] = useState<Date>(defaultStart);
  const [endDate, setEndDate] = useState<Date>(defaultEnd);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Standardmäßig nur Temperatur aktiviert
  const [selectedParams, setSelectedParams] = useState<ParameterSelection>({
    temperature: true,
    humidity: false,
    rainfall: false,
    sunshine: false
  });

  const [syncScales, setSyncScales] = useState(true);     // Skalensynchronisierung aktiv
  const [isFullscreen, setIsFullscreen] = useState(true);  // Vollbild-Modus aktiv

  // --- Performance-Optimierungen ---
  // Interpolations-Cache: berechnet fehlende Messwerte einmalig für alle Charts
  const interpolatedDataCache = useInterpolatedData(weatherData);
  // Synchronisierte Y-Achsen-Grenzen (gleiche Skala für alle Stationen pro Parameter)
  const syncedScales = useScaleSynchronization(weatherData, selectedParams, syncScales, interpolatedDataCache);

  // --- Event Handler (useCallback für stabile Funktionsreferenzen) ---
  const handleSyncScalesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSyncScales(e.target.checked);
  }, []);

  const handleFullscreenChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFullscreen(e.target.checked);
  }, []);

  const handleStartDateChange = useCallback((date: Date | null) => {
    if (date) setStartDate(roundToTenMinutes(date));
  }, []);

  const handleEndDateChange = useCallback((date: Date | null) => {
    if (date) setEndDate(roundToTenMinutes(date));
  }, []);

  const handleParamChange = useCallback((param: string, value: boolean) => {
    setSelectedParams(prev => ({ ...prev, [param]: value }));
  }, []);

  /**
   * Lädt die Wetterdaten von der GeoSphere API.
   * Baut den Parameter-String (z.B. "TL,RF") aus der Benutzerauswahl auf
   * und ruft den WeatherApiService mit Stations-IDs und Zeitraum auf.
   */
  const loadData = useCallback(async () => {
    if (stationIds.length === 0) {
      setErrorMessage('');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Aktive API-Parameter aus der Benutzerauswahl zusammenstellen
      const params: string[] = [];
      if (selectedParams.temperature) params.push('TL'); // Lufttemperatur
      if (selectedParams.humidity) params.push('RF');    // Relative Luftfeuchtigkeit
      if (selectedParams.rainfall) params.push('RR');   // Niederschlag
      if (selectedParams.sunshine) params.push('SO');   // Sonnenscheindauer

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
  }, [stationIds, startDate, endDate, selectedParams]);

  // Daten beim ersten Laden der Seite automatisch abrufen.
  // Bewusst ohne loadData in den Dependencies, um eine Endlosschleife zu vermeiden.
  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // Vollbild: container-fluid (volle Breite) oder container (zentriert mit max-width)
    <div className={isFullscreen ? 'container-fluid' : 'container'}>

      {/* Steuerungsleiste: Zeitraum, Parameter, Optionen und Laden-Button */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-start">

            {/* Startdatum-Auswahl */}
            <div className="col-12 col-lg-3">
              <label className="form-label">Von:</label>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={10}            // 10-Minuten-Raster (API-Datenauflösung)
                dateFormat="dd.MM.yyyy HH:mm"
                locale={de}                   // Deutsches Datumsformat
                className="form-control"
                placeholderText="dd.MM.yyyy HH:mm"
                maxDate={endDate}             // Startdatum darf nicht nach Enddatum liegen
              />
            </div>

            {/* Enddatum-Auswahl */}
            <div className="col-12 col-lg-3">
              <label className="form-label">Bis:</label>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={10}
                dateFormat="dd.MM.yyyy HH:mm"
                locale={de}
                className="form-control"
                placeholderText="dd.MM.yyyy HH:mm"
                minDate={startDate}           // Enddatum darf nicht vor Startdatum liegen
              />
            </div>

            {/* Wetterparameter-Auswahl (Temperatur, Luftfeuchtigkeit, Niederschlag, Sonnenschein) */}
            <div className="col-12 col-lg-3">
              <ParameterSelector
                {...selectedParams}
                onChange={handleParamChange}
              />
            </div>

            {/* Zusatzoptionen und Laden-Button */}
            <div className="col-12 col-lg-3">
              <div className="mb-3 mb-lg-4">
                {/* Skalensynchronisierung: gleiche Y-Achsen-Grenzen für alle Stationen */}
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sync-scales"
                    checked={syncScales}
                    onChange={handleSyncScalesChange}
                  />
                  <label className="form-check-label" htmlFor="sync-scales">
                    Skalen angleichen
                  </label>
                </div>

                {/* Vollbild-Modus: container-fluid für maximale Diagrammbreite */}
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="fullscreen"
                    checked={isFullscreen}
                    onChange={handleFullscreenChange}
                  />
                  <label className="form-check-label" htmlFor="fullscreen">
                    <FullscreenIcon /> Vollbild
                  </label>
                </div>
              </div>

              {/* Daten laden Button mit Ladezustand-Indikator */}
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

          {/* Warnung wenn keine Stationen in der URL übergeben wurden */}
          {stationIds.length === 0 && (
            <div className="alert alert-warning mt-3">
              Bitte wählen Sie zuerst Wetterstationen auf der <a href="/">Startseite</a> aus.
            </div>
          )}
        </div>
      </div>

      {/* Fehlermeldung bei API-Fehler */}
      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}

      {/* Diagramme: für jede Station eine eigene Chart-Card.
          Sortierung nach der ursprünglichen Auswahlreihenfolge (Reihenfolge im stationIds-Array). */}
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
                  interpolatedDataCache={interpolatedDataCache}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};
