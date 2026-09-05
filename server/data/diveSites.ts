import type { DiveSite } from '../domain/types.js'

// 실제 운영 전 검증된 포인트 이름과 좌표로 교체해야 하는 개발용 목록입니다.
export const diveSites: DiveSite[] = [
  {
    id: 'mock-east-1',
    siteName: '동해 샘플 포인트',
    areaName: '강원 샘플 지역',
    latitude: 37.78,
    longitude: 128.92,
    searchAliases: ['동해', '강원'],
  },
  {
    id: 'mock-south-1',
    siteName: '남해 샘플 포인트',
    areaName: '경남 샘플 지역',
    latitude: 34.82,
    longitude: 128.44,
    searchAliases: ['남해', '경남'],
  },
]
