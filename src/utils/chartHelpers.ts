import { PARAMETER_COLORS, PARAMETER_UNITS } from '../models/ChartTypes';

/**
 * Get the color for a specific weather parameter
 */
export function getParameterColor(param: string): string {
  const map: Record<string, string> = {
    temperature: PARAMETER_COLORS.temperature,
    humidity: PARAMETER_COLORS.humidity,
    rainfall: PARAMETER_COLORS.rainfall,
    sunshine: PARAMETER_COLORS.sunshine
  };
  return map[param] || '#000000';
}

/**
 * Get the Y-axis ID for a specific weather parameter
 */
export function getYAxisId(param: string): string {
  return `y-axis-${param}`;
}

/**
 * Get the unit label for a specific weather parameter
 */
export function getParameterUnit(param: string): string {
  const map: Record<string, string> = {
    temperature: PARAMETER_UNITS.temperature,
    humidity: PARAMETER_UNITS.humidity,
    rainfall: PARAMETER_UNITS.rainfall,
    sunshine: PARAMETER_UNITS.sunshine
  };
  return map[param] || '';
}
