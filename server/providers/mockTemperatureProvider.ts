import type { DiveSite, DiveSiteTemperature, TemperatureForecast } from '../domain/types.js'
import type { TemperatureProvider } from './temperatureProvider.js'

const mockForecasts: TemperatureForecast[] = [
  { date: '2026-09-05', kind: 'observation', profile: [{ depthMeters: 0, temperatureCelsius: 24 }, { depthMeters: 10, temperatureCelsius: 21 }, { depthMeters: 20, temperatureCelsius: 18 }] },
  { date: '2026-09-06', kind: 'model', profile: [{ depthMeters: 0, temperatureCelsius: 23.7 }, { depthMeters: 10, temperatureCelsius: 20.8 }, { depthMeters: 20, temperatureCelsius: 17.8 }] },
]

export class MockTemperatureProvider implements TemperatureProvider {
  async getTemperature(site: DiveSite, date?: string): Promise<DiveSiteTemperature> {
    const forecasts = date ? mockForecasts.filter((forecast) => forecast.date === date) : mockForecasts
    return {
      id: site.id,
      siteName: site.siteName,
      areaName: site.areaName,
      latitude: site.latitude,
      longitude: site.longitude,
      sourceLabel: '백엔드 개발용 목업',
      referenceDistanceKm: 0,
      updatedAt: '2026-09-05T09:00:00+09:00',
      forecasts,
    }
  }
}
