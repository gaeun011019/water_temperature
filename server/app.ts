import cors from '@fastify/cors'
import Fastify from 'fastify'
import { MemoryCache } from './cache/memoryCache.js'
import type { ServerConfig } from './config/env.js'
import { diveSites } from './data/diveSites.js'
import { AppError } from './domain/errors.js'
import type { DiveSiteTemperature } from './domain/types.js'
import { MockTemperatureProvider } from './providers/mockTemperatureProvider.js'
import type { TemperatureProvider } from './providers/temperatureProvider.js'
import { UnconfiguredProvider } from './providers/unconfiguredProvider.js'
import { healthRoutes } from './routes/health.js'
import { siteRoutes } from './routes/sites.js'
import { WaterTemperatureService } from './services/waterTemperatureService.js'

interface BuildServerOptions {
  config: ServerConfig
  provider?: TemperatureProvider
}

export async function buildServer({ config, provider }: BuildServerOptions) {
  const app = Fastify({ logger: false })
  await app.register(cors, { origin: true })
  const activeProvider = provider ?? (config.provider === 'mock' ? new MockTemperatureProvider() : new UnconfiguredProvider(config.provider))
  const cache = new MemoryCache<DiveSiteTemperature>(config.cacheTtlSeconds * 1000)
  const service = new WaterTemperatureService(diveSites, activeProvider, cache)

  await healthRoutes(app)
  await siteRoutes(app, service)

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) return reply.code(error.statusCode).send({ error: { code: error.code, message: error.message } })
    app.log.error(error)
    return reply.code(500).send({ error: { code: 'INTERNAL_ERROR', message: '서버에서 요청을 처리하지 못했습니다.' } })
  })

  return app
}
