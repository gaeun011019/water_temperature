export type TemperatureDataKind = 'observation' | 'model'

export interface DiveSite {
  id: string
  siteName: string
  areaName: string
  latitude: number
  longitude: number
  searchAliases: string[]
}

export interface DepthTemperature {
  depthMeters: number
  temperatureCelsius: number
}

export interface TemperatureForecast {
  date: string
  kind: TemperatureDataKind
  profile: DepthTemperature[]
}

export interface DiveSiteTemperature extends Omit<DiveSite, 'searchAliases'> {
  sourceLabel: string
  referenceDistanceKm: number
  updatedAt: string
  forecasts: TemperatureForecast[]
}
