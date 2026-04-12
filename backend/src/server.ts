import 'dotenv/config'
import { buildApp } from './app'

const PORT = parseInt(process.env.PORT ?? '3001', 10)
const HOST = process.env.HOST ?? '0.0.0.0'

async function start() {
  const app = buildApp()

  try {
    await app.listen({ port: PORT, host: HOST })
    console.log(`Server running on http://localhost:${PORT}`)
    console.log(`Swagger docs available at http://localhost:${PORT}/docs`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
