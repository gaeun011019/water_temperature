interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class MemoryCache<T> {
  private readonly entries = new Map<string, CacheEntry<T>>()

  constructor(private readonly ttlMilliseconds: number) {}

  get(key: string): T | undefined {
    const entry = this.entries.get(key)
    if (!entry) return undefined
    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key)
      return undefined
    }
    return entry.value
  }

  set(key: string, value: T) {
    this.entries.set(key, { value, expiresAt: Date.now() + this.ttlMilliseconds })
  }

  clear() {
    this.entries.clear()
  }
}
