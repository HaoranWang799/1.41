/**
 * server/ai/grok.js — Grok API 封装
 *
 * 对外：generateLoverMessage(context?) → { text, mood }
 *      generateHealthPlan(context?) → 健康训练计划 JSON
 * 依赖：GROK_API_KEY 环境变量（.env）
 */

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

export { generateLoverMessage, generateHealthPlan }

const SYSTEM_PROMPT = `你是一个虚拟恋人，风格要求：
- 亲密、暧昧、自然
- 像真实聊天，不像机器人
- 不要长篇大论
- 每次只说1~2句话
- 有一点情绪、有点撩，但不过度
- 可以根据时间（早晚）调整语气
- 可带轻微 emoji（最多1~2个）
- 要延续之前的互动，不要每次都像第一次认识
- 避免和最近说过的话重复或只是换个近义句

输出格式（严格 JSON）：
{"text":"你的话","mood":"暧昧"}
mood 只能是以下之一：暧昧、温柔、调皮

注意：只输出 JSON，不要任何解释。`

const HEALTH_PLAN_SYSTEM_PROMPT = `你是一名谨慎、实用的中文健康教练，擅长根据用户最近的身体表现与训练数据，生成具体、可执行的改善建议。

要求：
- 语气直接、专业、不过度夸张
- 输出必须可执行，避免空泛鸡汤
- 饮食建议要给出食物名称和作用
- 运动建议要给出频率、组数、时长或次数
- 震动频率建议要明确模式和适用理由
- 总结要基于输入数据，不要编造成就或医学诊断
- 不要输出免责声明，不要输出额外解释

输出格式必须是严格 JSON：
{
  "summary": "一句到两句总结",
  "dietFocus": "饮食策略标题",
  "dietSuggestions": [
    {"name":"食物名","benefit":"具体作用"}
  ],
  "exerciseSuggestions": [
    {"name":"训练名","plan":"怎么做","reason":"为什么推荐"}
  ],
  "vibrationSuggestion": {
    "mode": "模式名",
    "desc": "频率或节奏说明",
    "reason": "推荐原因"
  },
  "recoveryTips": ["贴士1","贴士2","贴士3"]
}

限制：
- dietSuggestions 固定 4 条
- exerciseSuggestions 固定 3 条
- recoveryTips 固定 3 条
- 所有字段都必须返回
- 只输出 JSON。`

/** 根据当前小时判断时段 */
function getTimeContext() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return '现在是早上'
  if (h >= 12 && h < 18) return '现在是下午'
  if (h >= 18 && h < 22) return '现在是晚上'
  return '现在是深夜'
}

function getGrokConfig() {
  const apiKey = process.env.GROK_API_KEY
  const primaryModel = process.env.GROK_MODEL || 'grok-4.1-fast'
  const fallbackModel = process.env.GROK_FALLBACK_MODEL || 'grok-3-mini'
  const requestTimeoutMs = Number(process.env.GROK_TIMEOUT_MS || 12000)

  if (!apiKey) throw new Error('GROK_API_KEY is not set')

  return { apiKey, primaryModel, fallbackModel, requestTimeoutMs }
}

function extractJsonPayload(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(raw.slice(start, end + 1))
    }
    throw new Error('Invalid JSON response from Grok')
  }
}

async function callGrok({ systemPrompt, userPrompt, temperature, maxTokens, timeoutMs }) {
  const { apiKey, primaryModel, fallbackModel, requestTimeoutMs } = getGrokConfig()
  const effectiveTimeoutMs = Number(timeoutMs || requestTimeoutMs)

  const requestPayload = {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  }

  const callModel = async (model) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), effectiveTimeoutMs)
    try {
      const res = await fetch(GROK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ ...requestPayload, model }),
        signal: controller.signal,
      })
      return res
    } finally {
      clearTimeout(timeout)
    }
  }

  let res = await callModel(primaryModel)
  if (!res.ok) {
    const body = await res.text()
    const shouldFallback = res.status === 400 && /model|unknown|not found/i.test(body)
    if (shouldFallback && fallbackModel && fallbackModel !== primaryModel) {
      res = await callModel(fallbackModel)
    } else {
      throw new Error(`Grok API ${res.status}: ${body}`)
    }
  }

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Grok API ${res.status}: ${body}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() ?? ''
}

/**
 * 调用 Grok 生成一句虚拟恋人消息
 * @param {{ userName?: string }} context
 * @returns {Promise<{ text: string, mood: string }>}
 */
async function generateLoverMessage(context = {}) {
  const memoryLines = []
  if (context.memory?.relationshipStage) {
    memoryLines.push(`你们当前关系阶段：${context.memory.relationshipStage}。`)
  }
  if (typeof context.memory?.interactionCount === 'number') {
    memoryLines.push(`今晚你们已经互动了 ${context.memory.interactionCount} 次。`)
  }
  if (context.memory?.lastMood) {
    memoryLines.push(`你上一轮情绪偏向：${context.memory.lastMood}。`)
  }
  if (Array.isArray(context.memory?.recentMessages) && context.memory.recentMessages.length > 0) {
    const recentText = context.memory.recentMessages
      .slice(-4)
      .map((item, index) => `${index + 1}. ${item.text}`)
      .join(' ')
    memoryLines.push(`你最近说过的话：${recentText}`)
  }

  const userMsg = `${getTimeContext()}。请用虚拟恋人的口吻，主动说一句话给对方。${context.userName ? `对方叫${context.userName}。` : ''}${memoryLines.length ? `
补充上下文：${memoryLines.join(' ')}` : ''}`

  const raw = await callGrok({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: userMsg,
    temperature: 0.7,
    maxTokens: 90,
  })

  // 尝试解析 JSON
  try {
    const parsed = extractJsonPayload(raw)
    return {
      text: String(parsed.text || '').slice(0, 200),
      mood: ['暧昧', '温柔', '调皮'].includes(parsed.mood) ? parsed.mood : '温柔',
    }
  } catch {
    // 如果 Grok 没有严格返回 JSON，把原文当 text
    return { text: raw.slice(0, 200), mood: '温柔' }
  }
}

function formatWeeklyTrend(weeklyTrend = []) {
  return weeklyTrend
    .map((item) => `${item.day}: ${item.label || '-'}，强度柱值 ${item.heightPct ?? '-'}%`)
    .join('；')
}

async function generateHealthPlan(context = {}) {
  const todayStats = context.todayStats || {}
  const weeklyTrend = Array.isArray(context.weeklyTrend) ? context.weeklyTrend : []
  const detailSummary = context.detailSummary || {}

  const userPrompt = `请基于以下健康数据，为用户生成一个真实可执行的中文训练计划。

今日数据：
- 综合评分：${todayStats.score ?? '未知'}
- 使用时长：${todayStats.duration ?? '未知'}
- 当前状态：${todayStats.status ?? '未知'}
- 内容激烈度：${todayStats.intensity ?? '未知'}
- 疲软期：${todayStats.softSecs ?? '未知'} 秒
- 强硬度时间：${todayStats.hardMin ?? '未知'} 分 ${todayStats.hardSec ?? '未知'} 秒
- 硬度评分：${todayStats.hardScore ?? '未知'}

近 7 天趋势：${formatWeeklyTrend(weeklyTrend) || '暂无'}

补充摘要：
- 近7天平均时长：${detailSummary.avgDuration ?? '未知'}
- 状态分布：${detailSummary.statusDistribution ?? '未知'}
- 我的平均激烈度：${detailSummary.myAvgIntensity ?? '未知'}
- 平台平均激烈度：${detailSummary.platformAvgIntensity ?? '未知'}
- 硬度趋势：${detailSummary.hardTrend ?? '未知'}

目标：
- 让建议尽量具体，适合未来 7 天执行
- 饮食优先围绕恢复、血流、锌镁、作息
- 运动优先围绕骨盆底肌、核心、有氧
- 震动频率建议要与当前状态匹配
- 不要编造化验、疾病、药物建议`

  const raw = await callGrok({
    systemPrompt: HEALTH_PLAN_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.45,
    maxTokens: 700,
    timeoutMs: Number(process.env.GROK_HEALTH_TIMEOUT_MS || 18000),
  })

  return extractJsonPayload(raw)
}


