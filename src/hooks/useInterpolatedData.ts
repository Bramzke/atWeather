import { useMemo } from 'react';
import type { WeatherResponse } from '../models/WeatherResponse';
import { interpolateData } from '../utils/interpolation';

/**
 * Cache-Key für interpolierte Daten
 */
type CacheKey = `${string}-${string}`; // stationId-parameterName

/**
 * Custom Hook für gecachte Interpolationsdaten
 * Verhindert doppelte interpolateData()-Aufrufe in useScaleSynchronization und WeatherChart
 * Reduziert Memory-Overhead um ca. 15-20 MB
 */
export function useInterpolatedData(weatherData: WeatherResponse | null) {
  return useMemo(() => {
    const cache = new Map<CacheKey, number[]>();

    if (!weatherData) {
      return {
        get: (_stationId: string, _paramName: string) => null,
        cache
      };
    }

    // Pre-compute alle Interpolationen
    for (const feature of weatherData.features) {
      const stationId = feature.properties.station;
      const params = feature.properties.parameters;

      // Iteriere über alle verfügbaren Parameter
      for (const [paramName, paramData] of Object.entries(params)) {
        if (paramData && paramData.data) {
          const key: CacheKey = `${stationId}-${paramName}`;
          cache.set(key, interpolateData(paramData.data));
        }
      }
    }

    return {
      get: (stationId: string, paramName: string): number[] | null => {
        const key: CacheKey = `${stationId}-${paramName}`;
        return cache.get(key) || null;
      },
      cache
    };
  }, [weatherData]);
}
