export interface ServerConfig {
  port: number
  host: string
  provider: 'mock' | 'nifs' | 'copernicus'
  cacheTtlSeconds: number
}

function positiveInteger(value: string | undefined, fallback: number, name: string) {
  if (value === undefined || value === '') return fallback
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`${name} must be a positive integer`)
  return parsed
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  const provider = env.DATA_PROVIDER ?? 'mock'
  if (!['mock', 'nifs', 'copernicus'].includes(provider)) throw new Error('DATA_PROVIDER must be mock, nifs, or copernicus')

  return {
    port: positiveInteger(env.SERVER_PORT, 8787, 'SERVER_PORT'),
    host: env.SERVER_HOST || '127.0.0.1',
    provider: provider as ServerConfig['provider'],
    cacheTtlSeconds: positiveInteger(env.CACHE_TTL_SECONDS, 1800, 'CACHE_TTL_SECONDS'),
  }
}
