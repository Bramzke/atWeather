import { useMemo } from 'react';
import type { WeatherResponse } from '../models/WeatherResponse';
import type { ParameterSelection } from '../models/ChartTypes';
import { getYAxisId } from '../utils/chartHelpers';
import type { useInterpolatedData } from './useInterpolatedData';

/** Min/Max-Grenzen einer Y-Achse */
export interface AxisScale {
  min?: number;
  max?: number;
}

/**
 * Skalenkonfiguration: Bildet Y-Achsen-IDs auf ihre Min/Max-Grenzen ab.
 * Beispiel: { "y-axis-temperature": { min: -5, max: 32 } }
 */
export interface ScaleConfig {
  [yAxisId: string]: AxisScale;
}

type ParameterType = 'temperature' | 'humidity' | 'rainfall' | 'sunshine';

/**
 * Custom Hook: Skalensynchronisierung für alle Weather-Charts.
 *
 * Berechnet globale Min/Max-Grenzen über alle ausgewählten Stationen hinweg,
 * sodass alle Charts denselben Y-Achsen-Bereich verwenden. Dadurch sind
 * Unterschiede zwischen Stationen direkt visuell vergleichbar.
 *
 * Ist die Synchronisierung deaktiviert (syncScales = false), wird ein leeres
 * Objekt zurückgegeben und jeder Chart skaliert sich selbst auf seine lokalen Daten.
 *
 * @param weatherData - API-Antwort mit allen Stationen (oder null)
 * @param selectedParams - Welche Parameter aktuell angezeigt werden
 * @param syncScales - Ob die Synchronisierung aktiv ist
 * @param interpolatedDataCache - Vorberechnete interpolierte Daten
 * @returns ScaleConfig mit Y-Achsen-Grenzen pro Parameter
 */
export function useScaleSynchronization(
  weatherData: WeatherResponse | null,
  selectedParams: ParameterSelection,
  syncScales: boolean,
  interpolatedDataCache: ReturnType<typeof useInterpolatedData>
): ScaleConfig {
  return useMemo(() => {
    // Früher Rückgabe: leeres Objekt wenn Synchronisierung deaktiviert oder keine Daten
    if (!syncScales || !weatherData) {
      return {};
    }

    const scaleConfig: ScaleConfig = {};

    // Mapping: interner Parameter-Typ → API-Parametername
    const paramMapping: Record<ParameterType, string> = {
      temperature: 'TL',
      humidity: 'RF',
      rainfall: 'RR',
      sunshine: 'SO'
    };

    const paramTypes: ParameterType[] = ['temperature', 'humidity', 'rainfall', 'sunshine'];

    // Für jeden Parameter die globalen Min/Max-Grenzen über alle Stationen ermitteln
    for (const paramType of paramTypes) {
      // Überspringe nicht ausgewählte Parameter
      if (!selectedParams[paramType]) continue;

      const apiParam = paramMapping[paramType];
      let globalMin: number | null = null;
      let globalMax: number | null = null;

      // Alle Stationen durchlaufen und Min/Max sammeln
      for (const feature of weatherData.features) {
        const paramData = feature.properties.parameters[apiParam as keyof typeof feature.properties.parameters];

        if (!paramData) continue;

        // Interpolierte Daten aus dem Cache holen (vermeidet doppelte Berechnung)
        const interpolated = interpolatedDataCache.get(feature.properties.station, apiParam);

        if (!interpolated) continue;

        // Min/Max dieser Station in die globalen Grenzen einbeziehen
        for (const value of interpolated) {
          if (globalMin === null || value < globalMin) globalMin = value;
          if (globalMax === null || value > globalMax) globalMax = value;
        }
      }

      // Gefundene globale Grenzen in der ScaleConfig speichern
      if (globalMin !== null && globalMax !== null) {
        const yAxisId = getYAxisId(paramType);
        scaleConfig[yAxisId] = {
          min: globalMin,
          max: globalMax
        };
      }
    }

    return scaleConfig;
  }, [weatherData, selectedParams, syncScales, interpolatedDataCache]);
}
