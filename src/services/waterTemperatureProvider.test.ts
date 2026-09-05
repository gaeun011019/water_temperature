import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpWaterTemperatureProvider, WaterTemperatureError } from './waterTemperatureProvider'

const validSite = {
  id: 'site-1', siteName: '테스트', areaName: '지역', latitude: 35, longitude: 129, sourceLabel: '출처',
  referenceDistanceKm: 1, updatedAt: '2026-09-05T00:00:00Z', forecasts: [],
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('HttpWaterTemperatureProvider', () => {
  it('검색어를 인코딩하고 유효한 목록을 반환한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([validSite]), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const provider = new HttpWaterTemperatureProvider({ baseUrl: 'https://example.test' })
    await expect(provider.searchSites('제주 포인트')).resolves.toEqual([validSite])
    expect(fetchMock).toHaveBeenCalledWith('https://example.test/sites?q=%EC%A0%9C%EC%A3%BC%20%ED%8F%AC%EC%9D%B8%ED%8A%B8', expect.any(Object))
  })

  it('잘못된 응답 형식을 response 오류로 변환한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: 'broken' }]), { status: 200 })))
    const provider = new HttpWaterTemperatureProvider({ baseUrl: '', retries: 0 })
    await expect(provider.searchSites('')).rejects.toMatchObject({ code: 'response' })
  })

  it('404 포인트는 undefined로 처리한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })))
    const provider = new HttpWaterTemperatureProvider({ baseUrl: '', retries: 0 })
    await expect(provider.getSiteTemperature('missing')).resolves.toBeUndefined()
  })

  it('일시적인 서버 오류 뒤 요청을 재시도한다', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(validSite), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const provider = new HttpWaterTemperatureProvider({ baseUrl: '', retries: 1 })
    await expect(provider.getSiteTemperature('site-1')).resolves.toEqual(validSite)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('제한 시간 이후 timeout 오류를 반환한다', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn((_url: string, options: RequestInit) => new Promise((_resolve, reject) => {
      options.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
    })))
    const provider = new HttpWaterTemperatureProvider({ baseUrl: '', retries: 0, timeoutMs: 100 })
    const request = provider.searchSites('test')
    const assertion = expect(request).rejects.toEqual(expect.objectContaining<Partial<WaterTemperatureError>>({ code: 'timeout' }))
    await vi.advanceTimersByTimeAsync(101)
    await assertion
  })

  it('연결 실패를 network 오류로 변환한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const provider = new HttpWaterTemperatureProvider({ baseUrl: '', retries: 0 })
    await expect(provider.searchSites('')).rejects.toMatchObject({ code: 'network' })
  })
})
