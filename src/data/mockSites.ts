import type { DiveSiteTemperature } from '../domain/waterTemperature'

// 화면 구조 확인용 가상 데이터입니다. 실제 수온이나 다이빙 판단에 사용할 수 없습니다.
export const mockSites: DiveSiteTemperature[] = [
  {
    id: 'mock-site-1',
    siteName: '샘플 다이빙 포인트',
    areaName: '샘플 지역',
    observedAt: '2026-09-05T09:00:00+09:00',
    sourceLabel: '화면 확인용 목업',
    profile: [
      { depthMeters: 0, temperatureCelsius: 24.8 },
      { depthMeters: 10, temperatureCelsius: 21.5 },
      { depthMeters: 20, temperatureCelsius: 18.9 },
    ],
  },
]

