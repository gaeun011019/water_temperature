export type TemperatureDataKind = 'observation' | 'model'

export interface DepthTemperature {
  depthMeters: number
  temperatureCelsius: number
}

export interface TemperatureForecast {
  date: string
  kind: TemperatureDataKind
  profile: DepthTemperature[]
}

export interface DiveSiteTemperature {
  id: string
  siteName: string
  areaName: string
  latitude: number
  longitude: number
  sourceLabel: string
  referenceDistanceKm: number
  updatedAt: string
  forecasts: TemperatureForecast[]
}

export interface PersonalDiveNote {
  id: string
  siteId: string
  date: string
  lowestTemperatureCelsius: number
  maxDepthMeters: number
  equipment: string[]
  conditionNote: string
}

export interface EquipmentItem {
  id: string
  name: string
  category: 'suit' | 'thermal' | 'accessory'
}

export interface DivePlan {
  id: string
  siteId: string
  date: string
  maxDepthMeters: number
  equipmentIds: string[]
  memo: string
  createdAt: string
}

export interface DiveLog {
  id: string
  siteId: string
  date: string
  maxDepthMeters: number
  lowestTemperatureCelsius: number
  equipmentIds: string[]
  comfort: 'cold' | 'comfortable' | 'warm'
  memo: string
}

export function getForecast(site: DiveSiteTemperature, date: string): TemperatureForecast | undefined {
  return site.forecasts.find((forecast) => forecast.date === date) ?? site.forecasts[0]
}

export function getProfileToDepth(forecast: TemperatureForecast | undefined, maxDepthMeters: number): DepthTemperature[] {
  if (!forecast) return []
  return forecast.profile.filter((item) => item.depthMeters <= maxDepthMeters)
}

export function getTemperatureRange(profile: DepthTemperature[]) {
  if (profile.length === 0) return undefined
  const values = profile.map((item) => item.temperatureCelsius)
  return { min: Math.min(...values), max: Math.max(...values) }
}

export function getLargeTemperatureDrops(profile: DepthTemperature[], thresholdCelsius = 1.5) {
  return profile.slice(1).flatMap((item, index) => {
    const previous = profile[index]
    const drop = previous.temperatureCelsius - item.temperatureCelsius
    return drop >= thresholdCelsius ? [{ fromDepth: previous.depthMeters, toDepth: item.depthMeters, drop }] : []
  })
}

export function isTemperatureDataStale(updatedAt: string, now = new Date(), staleAfterHours = 6) {
  const updatedTime = new Date(updatedAt).getTime()
  if (!Number.isFinite(updatedTime)) return true
  return now.getTime() - updatedTime > staleAfterHours * 60 * 60 * 1000
}

export function isDiveSiteTemperature(value: unknown): value is DiveSiteTemperature {
  if (!value || typeof value !== 'object') return false
  const site = value as Partial<DiveSiteTemperature>
  return typeof site.id === 'string'
    && typeof site.siteName === 'string'
    && typeof site.areaName === 'string'
    && Number.isFinite(site.latitude)
    && Number.isFinite(site.longitude)
    && typeof site.updatedAt === 'string'
    && Array.isArray(site.forecasts)
    && site.forecasts.every((forecast) => typeof forecast.date === 'string'
      && (forecast.kind === 'observation' || forecast.kind === 'model')
      && Array.isArray(forecast.profile)
      && forecast.profile.every((item) => Number.isFinite(item.depthMeters) && Number.isFinite(item.temperatureCelsius)))
}
