import { isDiveSiteTemperature, type DiveSiteTemperature } from '../domain/waterTemperature'

export class WaterTemperatureError extends Error {
  constructor(message: string, readonly code: 'timeout' | 'network' | 'response' | 'not-found') {
    super(message)
    this.name = 'WaterTemperatureError'
  }
}

export interface WaterTemperatureProvider {
  searchSites(query: string, signal?: AbortSignal): Promise<DiveSiteTemperature[]>
  getSiteTemperature(siteId: string, signal?: AbortSignal): Promise<DiveSiteTemperature | undefined>
}

interface HttpProviderOptions {
  baseUrl: string
  timeoutMs?: number
  retries?: number
}

export class HttpWaterTemperatureProvider implements WaterTemperatureProvider {
  private readonly timeoutMs: number
  private readonly retries: number

  constructor(private readonly options: HttpProviderOptions) {
    this.timeoutMs = options.timeoutMs ?? 8000
    this.retries = options.retries ?? 1
  }

  async searchSites(query: string, signal?: AbortSignal) {
    const value = await this.request(`/sites?q=${encodeURIComponent(query)}`, signal)
    if (!Array.isArray(value) || !value.every(isDiveSiteTemperature)) {
      throw new WaterTemperatureError('포인트 데이터 형식이 올바르지 않습니다.', 'response')
    }
    return value
  }

  async getSiteTemperature(siteId: string, signal?: AbortSignal) {
    try {
      const value = await this.request(`/sites/${encodeURIComponent(siteId)}`, signal)
      if (!isDiveSiteTemperature(value)) throw new WaterTemperatureError('수온 데이터 형식이 올바르지 않습니다.', 'response')
      return value
    } catch (error) {
      if (error instanceof WaterTemperatureError && error.code === 'not-found') return undefined
      throw error
    }
  }

  private async request(path: string, externalSignal?: AbortSignal): Promise<unknown> {
    let lastError: unknown
    for (let attempt = 0; attempt <= this.retries; attempt += 1) {
      const controller = new AbortController()
      const timeout = globalThis.setTimeout(() => controller.abort('timeout'), this.timeoutMs)
      const abortFromExternal = () => controller.abort(externalSignal?.reason)
      externalSignal?.addEventListener('abort', abortFromExternal, { once: true })
      try {
        const response = await fetch(`${this.options.baseUrl}${path}`, { signal: controller.signal })
        if (response.status === 404) throw new WaterTemperatureError('요청한 포인트를 찾지 못했습니다.', 'not-found')
        if (!response.ok) throw new WaterTemperatureError(`수온 서버 응답 오류 (${response.status})`, 'response')
        return await response.json()
      } catch (error) {
        if (error instanceof WaterTemperatureError && error.code === 'not-found') throw error
        lastError = controller.signal.reason === 'timeout'
          ? new WaterTemperatureError('수온 데이터를 불러오는 데 시간이 너무 오래 걸립니다.', 'timeout')
          : error instanceof WaterTemperatureError
            ? error
            : new WaterTemperatureError('수온 서버에 연결하지 못했습니다.', 'network')
      } finally {
        globalThis.clearTimeout(timeout)
        externalSignal?.removeEventListener('abort', abortFromExternal)
      }
    }
    throw lastError
  }
}
