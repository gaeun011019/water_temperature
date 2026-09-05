import { ProviderUnavailableError } from '../domain/errors.js'
import type { DiveSite, DiveSiteTemperature } from '../domain/types.js'
import type { TemperatureProvider } from './temperatureProvider.js'

export class UnconfiguredProvider implements TemperatureProvider {
  constructor(private readonly providerName: string) {}

  async getTemperature(_site: DiveSite, _date?: string, _signal?: AbortSignal): Promise<DiveSiteTemperature> {
    throw new ProviderUnavailableError(`${this.providerName} 공급자의 인증정보와 응답 변환기가 아직 설정되지 않았습니다.`)
  }
}
