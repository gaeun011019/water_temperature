import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryCache } from './memoryCache.js'

afterEach(() => vi.useRealTimers())

describe('MemoryCache', () => {
  it('만료 전에는 저장값을 반환한다', () => {
    const cache = new MemoryCache<string>(1000)
    cache.set('key', 'value')
    expect(cache.get('key')).toBe('value')
  })

  it('TTL이 지나면 저장값을 제거한다', () => {
    vi.useFakeTimers()
    const cache = new MemoryCache<string>(1000)
    cache.set('key', 'value')
    vi.advanceTimersByTime(1001)
    expect(cache.get('key')).toBeUndefined()
  })
})
