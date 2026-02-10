export const PARAMETER_COLORS = {
  temperature: '#000000',   // Schwarz
  humidity: '#4dc9f6',      // Hellblau
  rainfall: '#537bc4',      // Dunkelblau
  sunshine: '#fed976'       // Gelb
} as const;

export const PARAMETER_UNITS = {
  temperature: '°C',
  humidity: '%',
  rainfall: 'mm',
  sunshine: 'min'
} as const;

export interface ParameterSelection {
  temperature: boolean;
  humidity: boolean;
  rainfall: boolean;
  sunshine: boolean;
}
