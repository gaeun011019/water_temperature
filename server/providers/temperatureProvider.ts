import type { DiveSite, DiveSiteTemperature } from '../domain/types.js'

export interface TemperatureProvider {
  getTemperature(site: DiveSite, date?: string, signal?: AbortSignal): Promise<DiveSiteTemperature>
}
