export interface WeatherStation {
  id: string;
  name: string;
  state: string;
}

export const AUSTRIAN_STATES = [
  'Wien',
  'Kärnten',
  'Niederösterreich',
  'Burgenland',
  'Steiermark',
  'Oberösterreich',
  'Salzburg',
  'Tirol',
  'Vorarlberg'
] as const;

export type AustrianState = typeof AUSTRIAN_STATES[number];
