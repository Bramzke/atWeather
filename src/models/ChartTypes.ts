/**
 * Diagrammfarben für jeden Wetterparameter.
 * Schwarz für Temperatur ist bewusst gewählt – deutlich auf hellem Chartgrund,
 * aber auch auf dem dunklen Hintergrund sichtbar.
 */
export const PARAMETER_COLORS = {
  temperature: '#000000', // Schwarz
  humidity:    '#4dc9f6', // Hellblau
  rainfall:    '#537bc4', // Dunkelblau
  sunshine:    '#fed976'  // Gelb
} as const;

/**
 * Maßeinheiten für jeden Wetterparameter.
 * Werden in Y-Achsenbeschriftungen und Tooltips angezeigt.
 */
export const PARAMETER_UNITS = {
  temperature: '°C',  // Lufttemperatur
  humidity:    '%',   // Relative Luftfeuchtigkeit
  rainfall:    'mm',  // Niederschlagsmenge
  sunshine:    'min'  // Sonnenscheindauer pro 10-Minuten-Intervall
} as const;

/**
 * Auswahl der angezeigten Wetterparameter.
 * Wird als State in Weather.tsx und als Props in WeatherChart und ParameterSelector verwendet.
 */
export interface ParameterSelection {
  temperature: boolean; // Temperatur (API: TL)
  humidity: boolean;    // Luftfeuchtigkeit (API: RF)
  rainfall: boolean;    // Niederschlag (API: RR)
  sunshine: boolean;    // Sonnenschein (API: SO)
}
