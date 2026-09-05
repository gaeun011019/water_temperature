import { NotFoundError } from '../domain/errors.js'
import type { DiveSite, DiveSiteTemperature } from '../domain/types.js'
import type { MemoryCache } from '../cache/memoryCache.js'
import type { TemperatureProvider } from '../providers/temperatureProvider.js'

export class WaterTemperatureService {
  constructor(
    private readonly sites: DiveSite[],
    private readonly provider: TemperatureProvider,
    private readonly cache: MemoryCache<DiveSiteTemperature>,
  ) {}

  listSites(query = '') {
    const normalized = query.trim().toLowerCase()
    return this.sites
      .filter((site) => !normalized || [site.siteName, site.areaName, ...site.searchAliases].some((value) => value.toLowerCase().includes(normalized)))
      .map(({ searchAliases: _searchAliases, ...site }) => site)
  }

  async getSiteTemperature(siteId: string, date?: string) {
    const site = this.sites.find((item) => item.id === siteId)
    if (!site) throw new NotFoundError('등록되지 않은 다이빙 포인트입니다.')
    const cacheKey = `${siteId}:${date ?? 'all'}`
    const cached = this.cache.get(cacheKey)
    if (cached) return { data: cached, cache: 'hit' as const }
    const data = await this.provider.getTemperature(site, date)
    this.cache.set(cacheKey, data)
    return { data, cache: 'miss' as const }
  }
}
