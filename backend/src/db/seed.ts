/**
 * Script de seed manuel (alternative au seed SQL de Docker).
 * Usage : pnpm db:seed
 */
import 'dotenv/config'
import { db } from './index'
import * as fs from 'fs'
import * as path from 'path'

async function seed() {
  const sqlPath = path.join(__dirname, '../../sql/seed.sql')
  const sql = fs.readFileSync(sqlPath, 'utf-8')

  try {
    await db.query(sql)
    console.log('Seed completed successfully')
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  } finally {
    await db.end()
  }
}

seed()
