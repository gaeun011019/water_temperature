import { describe, expect, it } from 'vitest'
import { getForecast, getLargeTemperatureDrops, getProfileToDepth, getTemperatureRange, isDiveSiteTemperature, isTemperatureDataStale, type DiveSiteTemperature } from './waterTemperature'

const site: DiveSiteTemperature = {
  id: 'site-1', siteName: '테스트 포인트', areaName: '테스트 지역', latitude: 35, longitude: 129,
  sourceLabel: '테스트', referenceDistanceKm: 2, updatedAt: '2026-09-05T06:00:00Z',
  forecasts: [
    { date: '2026-09-05', kind: 'observation', profile: [{ depthMeters: 0, temperatureCelsius: 24 }, { depthMeters: 10, temperatureCelsius: 22.6 }, { depthMeters: 20, temperatureCelsius: 20.5 }] },
    { date: '2026-09-06', kind: 'model', profile: [{ depthMeters: 0, temperatureCelsius: 23 }] },
  ],
}

describe('수온 데이터 조회', () => {
  it('선택한 날짜의 예보를 반환한다', () => expect(getForecast(site, '2026-09-06')?.kind).toBe('model'))
  it('선택 날짜가 없으면 첫 예보를 사용한다', () => expect(getForecast(site, '2099-01-01')?.date).toBe('2026-09-05'))
  it('예보가 전혀 없으면 undefined를 반환한다', () => expect(getForecast({ ...site, forecasts: [] }, '2026-09-05')).toBeUndefined())
  it('최대 수심 이하의 값만 반환한다', () => expect(getProfileToDepth(site.forecasts[0], 10)).toHaveLength(2))
  it('예보가 없으면 빈 수심 배열을 반환한다', () => expect(getProfileToDepth(undefined, 20)).toEqual([]))
})

describe('수온 계산', () => {
  it('최저·최고 수온을 계산한다', () => expect(getTemperatureRange(site.forecasts[0].profile)).toEqual({ min: 20.5, max: 24 }))
  it('수온이 없으면 범위도 없다', () => expect(getTemperatureRange([])).toBeUndefined())
  it('임계값 이상 하락한 구간만 찾는다', () => {
    const drops = getLargeTemperatureDrops(site.forecasts[0].profile)
    expect(drops).toHaveLength(1)
    expect(drops[0]).toMatchObject({ fromDepth: 10, toDepth: 20 })
    expect(drops[0].drop).toBeCloseTo(2.1)
  })
  it('사용자가 지정한 임계값을 적용한다', () => expect(getLargeTemperatureDrops(site.forecasts[0].profile, 1)).toHaveLength(2))
})

describe('데이터 상태 검증', () => {
  it('기준 시간보다 오래된 데이터를 판정한다', () => expect(isTemperatureDataStale(site.updatedAt, new Date('2026-09-05T13:00:01Z'), 6)).toBe(true))
  it('유효하지 않은 날짜는 오래된 데이터로 처리한다', () => expect(isTemperatureDataStale('invalid')).toBe(true))
  it('정상적인 포인트 응답을 허용한다', () => expect(isDiveSiteTemperature(site)).toBe(true))
  it('숫자가 아닌 수온이 포함된 응답을 거부한다', () => expect(isDiveSiteTemperature({ ...site, forecasts: [{ ...site.forecasts[0], profile: [{ depthMeters: 10, temperatureCelsius: 'cold' }] }] })).toBe(false))
  it('필수 위치값이 없는 응답을 거부한다', () => { const { latitude: _latitude, ...invalid } = site; expect(isDiveSiteTemperature(invalid)).toBe(false) })
})
