import { useState } from 'react'

export function readStoredValue<T>(storage: Pick<Storage, 'getItem'>, key: string, initialValue: T, validate: (value: unknown) => value is T) {
  const storedValue = storage.getItem(key)
  if (!storedValue) return initialValue
  const parsed: unknown = JSON.parse(storedValue)
  if (!validate(parsed)) throw new Error('Invalid stored value')
  return parsed
}

export function writeStoredValue<T>(storage: Pick<Storage, 'setItem'>, key: string, value: T) {
  storage.setItem(key, JSON.stringify(value))
}

export function useLocalStorage<T>(key: string, initialValue: T, validate: (value: unknown) => value is T = (_value): _value is T => true) {
  const [error, setError] = useState<string>()
  const [value, setValue] = useState<T>(() => {
    try {
      return readStoredValue(window.localStorage, key, initialValue, validate)
    } catch {
      setTimeout(() => setError('저장된 데이터를 읽지 못해 기본값을 사용했습니다.'), 0)
      return initialValue
    }
  })

  const updateValue = (nextValue: T | ((current: T) => T)) => {
    setValue((current) => {
      const resolved = nextValue instanceof Function ? nextValue(current) : nextValue
      try {
        writeStoredValue(window.localStorage, key, resolved)
        setError(undefined)
      } catch {
        setError('브라우저 저장 공간에 기록하지 못했습니다. 입력 내용은 현재 화면에서만 유지됩니다.')
      }
      return resolved
    })
  }

  return [value, updateValue, error] as const
}
