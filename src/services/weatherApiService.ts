import type { WeatherResponse } from '../models/WeatherResponse';

export interface WeatherApiParams {
  stationIds: string[];
  start: Date;
  end: Date;
  parameters: string; // 'TL,RF,RR,SO'
}

/**
 * Service for interacting with the GeoSphere Austria Weather API
 */
export class WeatherApiService {
  private static readonly BASE_URL =
    'https://dataset.api.hub.geosphere.at/v1/station/historical/tawes-v1-10min';

  /**
   * Fetch weather data from the GeoSphere API
   * @param params API parameters including station IDs, date range, and weather parameters
   * @returns Promise<WeatherResponse> containing timestamps and features
   */
  static async getWeatherData(params: WeatherApiParams): Promise<WeatherResponse> {
    const { stationIds, start, end, parameters } = params;

    // Convert local time to UTC and format as yyyy-MM-ddTHH:mm
    const utcStart = start.toISOString().slice(0, 16);
    const utcEnd = end.toISOString().slice(0, 16);

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
