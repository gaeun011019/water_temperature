import type { DiveSiteTemperature } from '../domain/waterTemperature'

export interface WaterTemperatureProvider {
  searchSites(query: string): Promise<DiveSiteTemperature[]>
  getSiteTemperature(siteId: string): Promise<DiveSiteTemperature | undefined>
}

// 사용할 해양 관측 데이터가 정해지면 이 인터페이스의 구현체를 추가합니다.

