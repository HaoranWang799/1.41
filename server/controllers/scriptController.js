/**
 * server/controllers/scriptController.js — 脚本生成控制器
 */

import { generateScript, generateScriptText, generateScriptAudio } from '../services/scriptService.js'

export async function generateTextHandler(req, res, next) {
  try {
    const prompt = String(req.body?.prompt || '').trim()
    if (!prompt) return res.status(400).json({ error: '请输入描述' })
    if (prompt.length > 500) return res.status(400).json({ error: '描述太长，请控制在 500 字以内' })
    const apiKeyOverride = String(req.headers['x-grok-api-key'] || '').trim()
    const result = await generateScriptText(prompt, apiKeyOverride)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function generateAudioHandler(req, res, next) {
  try {
    const openingLine = String(req.body?.openingLine || '').trim()
    if (!openingLine) return res.status(400).json({ error: '开场白不能为空' })
    const result = await generateScriptAudio(openingLine)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function generateScriptHandler(req, res, next) {
  try {
    const prompt = String(req.body?.prompt || '').trim()

    if (!prompt) {
      return res.status(400).json({ error: '请输入描述' })
    }
    if (prompt.length > 500) {
      return res.status(400).json({ error: '描述太长，请控制在 500 字以内' })
    }

    const apiKeyOverride = String(req.headers['x-grok-api-key'] || '').trim()
    const result = await generateScript(prompt, apiKeyOverride)

    res.json(result)
  } catch (err) {
    next(err)
  }
}
