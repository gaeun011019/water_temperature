import { describe, expect, it, vi } from 'vitest'
import { readStoredValue, writeStoredValue } from './useLocalStorage'

const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string')

describe('로컬 저장 데이터', () => {
  it('저장된 값이 없으면 기본값을 사용한다', () => {
    const storage = { getItem: vi.fn().mockReturnValue(null) }
    expect(readStoredValue(storage, 'key', ['default'], isStringArray)).toEqual(['default'])
  })

  it('유효한 JSON과 타입이면 저장값을 반환한다', () => {
    const storage = { getItem: vi.fn().mockReturnValue('["hood"]') }
    expect(readStoredValue(storage, 'key', [], isStringArray)).toEqual(['hood'])
  })

  it('손상된 JSON을 거부한다', () => {
    const storage = { getItem: vi.fn().mockReturnValue('{broken') }
    expect(() => readStoredValue(storage, 'key', [], isStringArray)).toThrow()
  })

  it('예상 타입이 아닌 저장값을 거부한다', () => {
    const storage = { getItem: vi.fn().mockReturnValue('{"not":"array"}') }
    expect(() => readStoredValue(storage, 'key', [], isStringArray)).toThrow('Invalid stored value')
  })

  it('JSON 문자열로 값을 저장한다', () => {
    const storage = { setItem: vi.fn() }
    writeStoredValue(storage, 'equipment', ['hood'])
    expect(storage.setItem).toHaveBeenCalledWith('equipment', '["hood"]')
  })

  it('저장소가 발생시킨 오류를 호출자에게 전달한다', () => {
    const storage = { setItem: vi.fn(() => { throw new DOMException('Quota exceeded', 'QuotaExceededError') }) }
    expect(() => writeStoredValue(storage, 'equipment', ['hood'])).toThrow('Quota exceeded')
  })
})
