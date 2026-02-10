import { useMemo } from 'react';
import type { WeatherResponse } from '../models/WeatherResponse';
import type { ParameterSelection } from '../models/ChartTypes';
import { interpolateData } from '../utils/interpolation';
import { getYAxisId } from '../utils/chartHelpers';

export interface AxisScale {
  min?: number;
  max?: number;
}

export interface ScaleConfig {
  [yAxisId: string]: AxisScale;
}

type ParameterType = 'temperature' | 'humidity' | 'rainfall' | 'sunshine';

/**
 * Custom Hook für Skalensynchronisierung über alle Weather-Charts
 * Matched die Blazor-Implementierung exakt (Weather.razor Zeilen 500-592)
 */
export function useScaleSynchronization(
  weatherData: WeatherResponse | null,
  selectedParams: ParameterSelection,
  syncScales: boolean
): ScaleConfig {
  return useMemo(() => {
    // Early return: Auto-Scaling wenn deaktiviert oder keine Daten
    if (!syncScales || !weatherData) {
      return {};
    }

    const scaleConfig: ScaleConfig = {};

    // Mapping: Parameter-Typ → API-Parameter-Name
    const paramMapping: Record<ParameterType, string> = {
      temperature: 'TL',
      humidity: 'RF',
      rainfall: 'RR',
      sunshine: 'SO'
    };

    // Verarbeite jeden Parameter-Typ
    const paramTypes: ParameterType[] = ['temperature', 'humidity', 'rainfall', 'sunshine'];

    for (const paramType of paramTypes) {
      // Skip wenn Parameter nicht ausgewählt
      if (!selectedParams[paramType]) {
        continue;
      }

      const apiParam = paramMapping[paramType];
      let globalMin: number | null = null;
      let globalMax: number | null = null;

      // Sammle Min/Max über alle Stationen für diesen Parameter
      for (const feature of weatherData.features) {
        const paramData = feature.properties.parameters[apiParam as keyof typeof feature.properties.parameters];

        if (!paramData) {
          continue;
        }

        // Wende Interpolation an (matched Blazor-Verhalten)
        const interpolated = interpolateData(paramData.data);

        // Finde Min/Max in diesem Dataset
        for (const value of interpolated) {
          if (globalMin === null || value < globalMin) {
            globalMin = value;
          }
          if (globalMax === null || value > globalMax) {
            globalMax = value;
          }
        }
      }

      // Wenn Daten gefunden, nutze exakt die globalen Grenzen
      if (globalMin !== null && globalMax !== null) {
        // Speichere in Config mit Y-Achsen-ID
        const yAxisId = getYAxisId(paramType);
        scaleConfig[yAxisId] = {
          min: globalMin,
          max: globalMax
        };
      }
    }

    return scaleConfig;
  }, [weatherData, selectedParams, syncScales]);
}
