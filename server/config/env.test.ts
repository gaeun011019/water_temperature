import { describe, expect, it } from 'vitest'
import { loadConfig } from './env.js'

describe('서버 환경변수', () => {
  it('값이 없으면 개발 기본값을 사용한다', () => {
    expect(loadConfig({})).toEqual({ port: 8787, host: '127.0.0.1', provider: 'mock', cacheTtlSeconds: 1800 })
  })

  it('환경변수를 설정값으로 변환한다', () => {
    expect(loadConfig({ SERVER_PORT: '9000', SERVER_HOST: '0.0.0.0', DATA_PROVIDER: 'nifs', CACHE_TTL_SECONDS: '60' })).toEqual({ port: 9000, host: '0.0.0.0', provider: 'nifs', cacheTtlSeconds: 60 })
  })

  it('잘못된 포트와 공급자를 거부한다', () => {
    expect(() => loadConfig({ SERVER_PORT: 'abc' })).toThrow('SERVER_PORT')
    expect(() => loadConfig({ DATA_PROVIDER: 'unknown' })).toThrow('DATA_PROVIDER')
  })
})
