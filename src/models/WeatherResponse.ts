/**
 * Vollständige API-Antwort der GeoSphere Austria.
 * Enthält gemeinsame Zeitstempel für alle Stationen und
 * ein Feature-Array mit den stationsspezifischen Messwerten.
 */
export interface WeatherResponse {
  timestamps: string[]; // ISO 8601 UTC-Zeitstempel im 10-Minuten-Raster
  features: Feature[];  // Ein Feature pro angefragter Wetterstation
}

/**
 * GeoJSON-Feature einer einzelnen Wetterstation.
 */
export interface Feature {
  type: string;           // GeoJSON-Typ (immer "Feature")
  geometry: Geometry;     // Geografische Position der Station
  properties: Properties; // Messdaten und Stations-ID
}

/**
 * Geografische Position der Wetterstation (GeoJSON-Punkt).
 */
export interface Geometry {
  type: string;         // GeoJSON-Geometrietyp (immer "Point")
  coordinates: number[]; // [Längengrad, Breitengrad, Höhe über NN]
}

/**
 * Eigenschaften eines Stations-Features.
 */
export interface Properties {
  parameters: Parameters; // Messdaten nach API-Parameter-Code
  station: string;        // Stations-ID (z.B. "11019")
}

/**
 * Messdaten einer Station, aufgeschlüsselt nach API-Parameter-Code.
 * Alle Parameter sind optional, da nicht jede Station alle Messgeräte hat.
 */
export interface Parameters {
  TL?: ParameterData; // Lufttemperatur (°C)
  RF?: ParameterData; // Relative Luftfeuchtigkeit (%)
  RR?: ParameterData; // Niederschlag (mm)
  SO?: ParameterData; // Sonnenscheindauer (min)
}

/**
 * Messdatenreihe für einen einzelnen Parameter.
 */
export interface ParameterData {
  name: string;              // Langer Parametername (z.B. "Lufttemperatur")
  unit: string;              // Einheit (z.B. "°C")
  data: (number | null)[];   // Messwerte parallel zu den Zeitstempeln; null bei Messausfall
}
