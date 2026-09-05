import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildServer } from './app.js'
import type { ServerConfig } from './config/env.js'
import type { DiveSite, DiveSiteTemperature } from './domain/types.js'
import type { TemperatureProvider } from './providers/temperatureProvider.js'

const config: ServerConfig = { port: 8787, host: '127.0.0.1', provider: 'mock', cacheTtlSeconds: 60 }
const servers: Awaited<ReturnType<typeof buildServer>>[] = []

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => server.close()))
})

describe('백엔드 API', () => {
  it('서버 상태를 확인한다', async () => {
    const app = await buildServer({ config })
    servers.push(app)
    const response = await app.inject({ method: 'GET', url: '/health' })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({ status: 'ok' })
  })

  it('포인트 목록을 검색한다', async () => {
    const app = await buildServer({ config })
    servers.push(app)
    const response = await app.inject({ method: 'GET', url: '/api/sites?q=%EB%8F%99%ED%95%B4' })
    expect(response.statusCode).toBe(200)
    expect(response.json().data).toHaveLength(1)
    expect(response.json().data[0].siteName).toBe('동해 샘플 포인트')
    expect(response.json().data[0]).not.toHaveProperty('searchAliases')
  })

  it('포인트 수온을 반환하고 두 번째 요청에서 캐시를 사용한다', async () => {
    const provider: TemperatureProvider = {
      getTemperature: vi.fn(async (site: DiveSite): Promise<DiveSiteTemperature> => ({ ...site, sourceLabel: 'test', referenceDistanceKm: 0, updatedAt: '2026-09-05T00:00:00Z', forecasts: [] })),
    }
    const app = await buildServer({ config, provider })
    servers.push(app)
    const first = await app.inject({ method: 'GET', url: '/api/sites/mock-east-1' })
    const second = await app.inject({ method: 'GET', url: '/api/sites/mock-east-1' })
    expect(first.headers['x-cache']).toBe('miss')
    expect(second.headers['x-cache']).toBe('hit')
    expect(provider.getTemperature).toHaveBeenCalledTimes(1)
  })

  it('잘못된 날짜 형식을 400으로 거부한다', async () => {
    const app = await buildServer({ config })
    servers.push(app)
    const response = await app.inject({ method: 'GET', url: '/api/sites/mock-east-1?date=09-05-2026' })
    expect(response.statusCode).toBe(400)
    expect(response.json().error.code).toBe('INVALID_DATE')
  })

  it('등록되지 않은 포인트를 404로 처리한다', async () => {
    const app = await buildServer({ config })
    servers.push(app)
    const response = await app.inject({ method: 'GET', url: '/api/sites/missing' })
    expect(response.statusCode).toBe(404)
    expect(response.json().error.code).toBe('NOT_FOUND')
  })

  it('설정되지 않은 실제 공급자를 503으로 처리한다', async () => {
    const app = await buildServer({ config: { ...config, provider: 'nifs' } })
    servers.push(app)
    const response = await app.inject({ method: 'GET', url: '/api/sites/mock-east-1' })
    expect(response.statusCode).toBe(503)
    expect(response.json().error.code).toBe('PROVIDER_UNAVAILABLE')
  })
})
