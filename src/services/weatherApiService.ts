import type { WeatherResponse } from '../models/WeatherResponse';

/** Parameter für einen API-Aufruf */
export interface WeatherApiParams {
  stationIds: string[]; // Liste der Stations-IDs (z.B. ["11019", "11018"])
  start: Date;          // Startzeitpunkt des Abfragezeitraums
  end: Date;            // Endzeitpunkt des Abfragezeitraums
  parameters: string;   // Kommagetrennte Parameter-Codes (z.B. "TL,RF,RR,SO")
}

/**
 * Service für die Kommunikation mit der GeoSphere Austria Wetter-API.
 *
 * Verwendet den öffentlichen TAWES-Endpunkt (Teilautomatische Wetterstationen)
 * der GeoSphere Austria für historische 10-Minuten-Messdaten.
 *
 * API-Dokumentation: https://dataset.api.hub.geosphere.at/app/frontend/station/historical/tawes-v1-10min
 */
export class WeatherApiService {
  /** Basis-URL des historischen TAWES-Endpunkts */
  private static readonly BASE_URL =
    'https://dataset.api.hub.geosphere.at/v1/station/historical/tawes-v1-10min';

  /**
   * Ruft historische Wetterdaten für eine oder mehrere Stationen ab.
   *
   * Zeitangaben werden als UTC-Zeitstempel übergeben (ISO 8601, auf Minuten gekürzt).
   * Die API gibt ein GeoJSON-ähnliches Format zurück mit gemeinsamen Zeitstempeln
   * und einem Feature pro Wetterstation.
   *
   * @param params - Stations-IDs, Zeitraum und gewünschte Messparameter
   * @returns Promise mit Zeitstempeln und stationsbezogenen Messwerten
   * @throws Error bei HTTP-Fehlern oder Netzwerkproblemen
   */
  static async getWeatherData(params: WeatherApiParams): Promise<WeatherResponse> {
    const { stationIds, start, end, parameters } = params;

    // Datum in UTC-Format konvertieren (API erwartet UTC, kein Offset)
    const utcStart = start.toISOString().slice(0, 16); // "yyyy-MM-ddTHH:mm"
    const utcEnd = end.toISOString().slice(0, 16);

    // Mehrere Stations-IDs als kommagetrennte Liste übergeben
    const stationIdsParam = stationIds.join(',');
    const url = `${this.BASE_URL}?parameters=${parameters}&station_ids=${stationIdsParam}&start=${utcStart}&end=${utcEnd}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API-Fehler: ${response.statusText}`);
      }

      const data: WeatherResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Fehler beim Laden der Wetterdaten: ${error.message}`);
      }
      throw new Error('Unbekannter Fehler beim Laden der Wetterdaten');
    }
  }
}
