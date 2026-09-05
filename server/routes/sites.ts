import type { FastifyInstance } from 'fastify'
import type { WaterTemperatureService } from '../services/waterTemperatureService.js'

export async function siteRoutes(app: FastifyInstance, service: WaterTemperatureService) {
  app.get<{ Querystring: { q?: string } }>('/api/sites', async (request) => ({ data: service.listSites(request.query.q) }))

  app.get<{ Params: { siteId: string }; Querystring: { date?: string } }>('/api/sites/:siteId', async (request, reply) => {
    const { date } = request.query
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return reply.code(400).send({ error: { code: 'INVALID_DATE', message: 'date는 YYYY-MM-DD 형식이어야 합니다.' } })
    const result = await service.getSiteTemperature(request.params.siteId, date)
    reply.header('X-Cache', result.cache)
    return { data: result.data }
  })
}
