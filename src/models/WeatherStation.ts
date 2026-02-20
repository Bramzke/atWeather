/**
 * Stammdaten einer österreichischen Wetterstation.
 * Stationen sind in data/stations.ts als statische Liste hinterlegt.
 */
export interface WeatherStation {
  id: string;    // GeoSphere-Stations-ID (z.B. "11019")
  name: string;  // Anzeigename (z.B. "Wien-Innere Stadt")
  state: string; // Österreichisches Bundesland
}

/**
 * Alle österreichischen Bundesländer in der gewünschten Anzeigereihenfolge.
 * Wien wird zuerst angezeigt, gefolgt von den übrigen Bundesländern.
 */
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

/** TypeScript-Typ für ein gültiges österreichisches Bundesland */
export type AustrianState = typeof AUSTRIAN_STATES[number];
