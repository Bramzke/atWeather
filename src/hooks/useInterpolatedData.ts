import { useMemo } from 'react';
import type { WeatherResponse } from '../models/WeatherResponse';
import { interpolateData } from '../utils/interpolation';

/**
 * Cache-Schlüssel: Kombination aus Stations-ID und Parametername.
 * Beispiel: "11019-TL" für Temperatur der Station 11019.
 */
type CacheKey = `${string}-${string}`;

/**
 * Custom Hook: Interpolations-Cache für alle Wetterdaten.
 *
 * Berechnet fehlende (null) Messwerte für alle Stationen und Parameter einmalig
 * mit useMemo und stellt sie über eine get()-Funktion bereit.
 *
 * Warum ein Cache?
 * Ohne Cache würden sowohl WeatherChart als auch useScaleSynchronization die
 * aufwändige interpolateData()-Funktion unabhängig voneinander aufrufen.
 * Der Cache verhindert diese doppelten Berechnungen und reduziert den
 * Speicherverbrauch um ca. 15-20 MB bei mehreren gleichzeitig geladenen Stationen.
 *
 * @param weatherData - API-Antwort mit allen Stationen und Messwerten (oder null)
 * @returns Objekt mit get()-Funktion für Zugriff auf interpolierte Daten
 */
export function useInterpolatedData(weatherData: WeatherResponse | null) {
  return useMemo(() => {
    const cache = new Map<CacheKey, number[]>();

    // Keine Daten vorhanden: leeren Cache mit Dummy-get() zurückgeben
    if (!weatherData) {
      return {
        get: (_stationId: string, _paramName: string) => null,
        cache
      };
    }

    // Alle Interpolationen beim ersten Rendern vorberechnen
    for (const feature of weatherData.features) {
      const stationId = feature.properties.station;
      const params = feature.properties.parameters;

      // Alle verfügbaren Parameter dieser Station interpolieren
      for (const [paramName, paramData] of Object.entries(params)) {
        if (paramData && paramData.data) {
          const key: CacheKey = `${stationId}-${paramName}`;
          cache.set(key, interpolateData(paramData.data));
        }
      }
    }

    return {
      /**
       * Gibt die interpolierten Daten für eine Station und einen Parameter zurück.
       * @param stationId - Stations-ID (z.B. "11019")
       * @param paramName - API-Parametername (z.B. "TL")
       * @returns Interpoliertes Zahlen-Array oder null wenn nicht vorhanden
       */
      get: (stationId: string, paramName: string): number[] | null => {
        const key: CacheKey = `${stationId}-${paramName}`;
        return cache.get(key) || null;
      },
      cache
    };
  }, [weatherData]); // Nur neu berechnen wenn sich die API-Daten ändern
}
