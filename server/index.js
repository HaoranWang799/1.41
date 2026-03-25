/**
 * server/index.js — 后端入口
 *
 * 端口：3100（避开 Vite 5173）
 * 路由：POST /api/lover/message
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import express from 'express'
import { createLoverMessageResponse } from './lover/service.js'
import { clearLoverMemory } from './lover/memory.js'
import { clearLoverCache } from './lover/cache.js'
import { createHealthPlan } from './health/service.js'

// dotenv 加载 server/.env
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '.env') })

const app = express()
app.use(express.json())

const LOVER_CACHE_TTL_MS = Number(process.env.LOVER_CACHE_TTL_MS || 120000)
const LOVER_MAX_WAIT_MS = Number(process.env.LOVER_MAX_WAIT_MS || 1200)
const LOVER_FORCE_WAIT_MS = Number(process.env.LOVER_FORCE_WAIT_MS || 1800)

// ── API 路由 ──────────────────────────────────────────────
app.post('/api/lover/message', async (req, res) => {
  const context = {
    userName: typeof req.body?.userName === 'string' ? req.body.userName.slice(0, 20) : undefined,
  }
  const forceRefresh = Boolean(req.body?.forceRefresh)

  const result = await createLoverMessageResponse({
    context,
    forceRefresh,
    cacheTtlMs: LOVER_CACHE_TTL_MS,
    maxWaitMs: LOVER_MAX_WAIT_MS,
    forceWaitMs: LOVER_FORCE_WAIT_MS,
  })
  res.json(result)
})

app.delete('/api/lover/memory', async (_req, res) => {
  await clearLoverMemory()
  clearLoverCache()
  res.json({ ok: true })
})

app.post('/api/health/plan', async (req, res) => {
  const payload = {
    todayStats: req.body?.todayStats && typeof req.body.todayStats === 'object' ? req.body.todayStats : {},
    weeklyTrend: Array.isArray(req.body?.weeklyTrend) ? req.body.weeklyTrend : [],
    detailSummary: req.body?.detailSummary && typeof req.body.detailSummary === 'object' ? req.body.detailSummary : {},
  }

  const result = await createHealthPlan(payload)
  res.json({ ok: true, ...result })
})

// ── 启动 ──────────────────────────────────────────────────
const PORT = process.env.PORT || 3100
app.listen(PORT, () => {
  console.log(`✅ AI Server running at http://localhost:${PORT}`)
})
