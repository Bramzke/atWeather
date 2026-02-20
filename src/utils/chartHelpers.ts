import { PARAMETER_COLORS, PARAMETER_UNITS } from '../models/ChartTypes';

/**
 * Gibt die Diagrammfarbe für einen Wetterparameter zurück.
 * Farben sind in ChartTypes.ts als Konstante definiert.
 *
 * @param param - Interner Parameter-Schlüssel (z.B. 'temperature')
 * @returns Hex-Farbcode (z.B. '#000000')
 */
export function getParameterColor(param: string): string {
  const map: Record<string, string> = {
    temperature: PARAMETER_COLORS.temperature,
    humidity:    PARAMETER_COLORS.humidity,
    rainfall:    PARAMETER_COLORS.rainfall,
    sunshine:    PARAMETER_COLORS.sunshine
  };
  return map[param] || '#000000'; // Fallback: Schwarz
}

/**
 * Erzeugt die ECharts Y-Achsen-ID für einen Parameter.
 * Die ID wird verwendet um Serien und Achsen einander zuzuordnen.
 *
 * @param param - Interner Parameter-Schlüssel (z.B. 'temperature')
 * @returns Y-Achsen-ID (z.B. 'y-axis-temperature')
 */
export function getYAxisId(param: string): string {
  return `y-axis-${param}`;
}

/**
 * Gibt die Maßeinheit für einen Wetterparameter zurück.
 * Einheiten sind in ChartTypes.ts als Konstante definiert.
 *
 * @param param - Interner Parameter-Schlüssel (z.B. 'temperature')
 * @returns Einheitenstring (z.B. '°C', '%', 'mm', 'min')
 */
export function getParameterUnit(param: string): string {
  const map: Record<string, string> = {
    temperature: PARAMETER_UNITS.temperature,
    humidity:    PARAMETER_UNITS.humidity,
    rainfall:    PARAMETER_UNITS.rainfall,
    sunshine:    PARAMETER_UNITS.sunshine
  };
  return map[param] || ''; // Fallback: leerer String
}
