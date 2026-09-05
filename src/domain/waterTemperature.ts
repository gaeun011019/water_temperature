export interface DepthTemperature {
  depthMeters: number
  temperatureCelsius: number
}

export interface DiveSiteTemperature {
  id: string
  siteName: string
  areaName: string
  observedAt: string
  sourceLabel: string
  profile: DepthTemperature[]
}

export function getSurfaceTemperature(site: DiveSiteTemperature): number | undefined {
  return [...site.profile].sort((a, b) => a.depthMeters - b.depthMeters)[0]?.temperatureCelsius
}

export function getLowestTemperature(site: DiveSiteTemperature): number | undefined {
  if (site.profile.length === 0) return undefined
  return Math.min(...site.profile.map((item) => item.temperatureCelsius))
}

