import type { DiveSiteTemperature, PersonalDiveNote } from '../domain/waterTemperature'

// 아래 장소명과 모든 수치는 UI 동작을 확인하기 위한 가상 데이터입니다.
export const mockSites: DiveSiteTemperature[] = [
  {
    id: 'mock-east-1',
    siteName: '동해 샘플 포인트',
    areaName: '강원 샘플 지역',
    latitude: 37.78,
    longitude: 128.92,
    sourceLabel: '해양 모델 예시',
    referenceDistanceKm: 8.4,
    updatedAt: '2026-09-05T08:00:00+09:00',
    forecasts: [
      { date: '2026-09-05', kind: 'observation', profile: [{ depthMeters: 0, temperatureCelsius: 24.1 }, { depthMeters: 5, temperatureCelsius: 23.4 }, { depthMeters: 10, temperatureCelsius: 21.2 }, { depthMeters: 15, temperatureCelsius: 18.7 }, { depthMeters: 20, temperatureCelsius: 16.9 }, { depthMeters: 25, temperatureCelsius: 15.8 }, { depthMeters: 30, temperatureCelsius: 15.1 }] },
      { date: '2026-09-06', kind: 'model', profile: [{ depthMeters: 0, temperatureCelsius: 23.8 }, { depthMeters: 5, temperatureCelsius: 23.1 }, { depthMeters: 10, temperatureCelsius: 20.8 }, { depthMeters: 15, temperatureCelsius: 18.4 }, { depthMeters: 20, temperatureCelsius: 16.7 }, { depthMeters: 25, temperatureCelsius: 15.6 }, { depthMeters: 30, temperatureCelsius: 14.9 }] },
      { date: '2026-09-07', kind: 'model', profile: [{ depthMeters: 0, temperatureCelsius: 23.5 }, { depthMeters: 5, temperatureCelsius: 22.9 }, { depthMeters: 10, temperatureCelsius: 20.5 }, { depthMeters: 15, temperatureCelsius: 18.2 }, { depthMeters: 20, temperatureCelsius: 16.5 }, { depthMeters: 25, temperatureCelsius: 15.4 }, { depthMeters: 30, temperatureCelsius: 14.8 }] },
    ],
  },
  {
    id: 'mock-south-1',
    siteName: '남해 샘플 포인트',
    areaName: '경남 샘플 지역',
    latitude: 34.82,
    longitude: 128.44,
    sourceLabel: '인근 관측소 예시',
    referenceDistanceKm: 5.1,
    updatedAt: '2026-09-05T08:30:00+09:00',
    forecasts: [
      { date: '2026-09-05', kind: 'observation', profile: [{ depthMeters: 0, temperatureCelsius: 25.6 }, { depthMeters: 5, temperatureCelsius: 25.1 }, { depthMeters: 10, temperatureCelsius: 24.2 }, { depthMeters: 15, temperatureCelsius: 23.3 }, { depthMeters: 20, temperatureCelsius: 22.4 }, { depthMeters: 25, temperatureCelsius: 21.8 }, { depthMeters: 30, temperatureCelsius: 21.2 }] },
      { date: '2026-09-06', kind: 'model', profile: [{ depthMeters: 0, temperatureCelsius: 25.4 }, { depthMeters: 5, temperatureCelsius: 24.9 }, { depthMeters: 10, temperatureCelsius: 24 }, { depthMeters: 15, temperatureCelsius: 23 }, { depthMeters: 20, temperatureCelsius: 22.1 }, { depthMeters: 25, temperatureCelsius: 21.5 }, { depthMeters: 30, temperatureCelsius: 20.9 }] },
      { date: '2026-09-07', kind: 'model', profile: [{ depthMeters: 0, temperatureCelsius: 25.2 }, { depthMeters: 5, temperatureCelsius: 24.7 }, { depthMeters: 10, temperatureCelsius: 23.8 }, { depthMeters: 15, temperatureCelsius: 22.8 }, { depthMeters: 20, temperatureCelsius: 22 }, { depthMeters: 25, temperatureCelsius: 21.4 }, { depthMeters: 30, temperatureCelsius: 20.8 }] },
    ],
  },
  {
    id: 'mock-jeju-1',
    siteName: '제주 샘플 포인트',
    areaName: '제주 샘플 지역',
    latitude: 33.24,
    longitude: 126.56,
    sourceLabel: '해양 모델 예시',
    referenceDistanceKm: 11.7,
    updatedAt: '2026-09-05T08:00:00+09:00',
    forecasts: [
      { date: '2026-09-05', kind: 'observation', profile: [{ depthMeters: 0, temperatureCelsius: 27.2 }, { depthMeters: 5, temperatureCelsius: 26.8 }, { depthMeters: 10, temperatureCelsius: 26.1 }, { depthMeters: 15, temperatureCelsius: 25.2 }, { depthMeters: 20, temperatureCelsius: 24.4 }, { depthMeters: 25, temperatureCelsius: 23.9 }, { depthMeters: 30, temperatureCelsius: 23.5 }] },
      { date: '2026-09-06', kind: 'model', profile: [{ depthMeters: 0, temperatureCelsius: 27 }, { depthMeters: 5, temperatureCelsius: 26.6 }, { depthMeters: 10, temperatureCelsius: 25.9 }, { depthMeters: 15, temperatureCelsius: 25 }, { depthMeters: 20, temperatureCelsius: 24.2 }, { depthMeters: 25, temperatureCelsius: 23.7 }, { depthMeters: 30, temperatureCelsius: 23.3 }] },
      { date: '2026-09-07', kind: 'model', profile: [{ depthMeters: 0, temperatureCelsius: 26.9 }, { depthMeters: 5, temperatureCelsius: 26.5 }, { depthMeters: 10, temperatureCelsius: 25.8 }, { depthMeters: 15, temperatureCelsius: 24.9 }, { depthMeters: 20, temperatureCelsius: 24.1 }, { depthMeters: 25, temperatureCelsius: 23.6 }, { depthMeters: 30, temperatureCelsius: 23.2 }] },
    ],
  },
]

export const mockPersonalDiveNotes: PersonalDiveNote[] = [
  {
    id: 'mock-note-1',
    siteId: 'mock-east-1',
    date: '2026-08-16',
    lowestTemperatureCelsius: 17,
    maxDepthMeters: 21,
    equipment: ['5mm 슈트', '후드', '장갑'],
    conditionNote: '개인 기록 예시',
  },
]

