export interface WeatherResponse {
  timestamps: string[];
  features: Feature[];
}

export interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  parameters: Parameters;
  station: string;
}

export interface Parameters {
  TL?: ParameterData;  // Temperature
  RF?: ParameterData;  // Humidity
  RR?: ParameterData;  // Rainfall
  SO?: ParameterData;  // Sunshine
}

export interface ParameterData {
  name: string;
  unit: string;
  data: (number | null)[];
}
