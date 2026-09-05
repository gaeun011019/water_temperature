import 'dotenv/config'
import { buildServer } from './app.js'
import { loadConfig } from './config/env.js'

const config = loadConfig()
const app = await buildServer({ config })

try {
  await app.listen({ port: config.port, host: config.host })
  console.log(`Water temperature API listening on http://${config.host}:${config.port}`)
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
