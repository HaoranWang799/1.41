import { useCallback, useRef, useState } from 'react'
import { clearVirtualLoverMemory, fetchVirtualLoverBatch } from '../api/virtualLover'

// ── 5 条写死预设台词（页面打开即可用，0ms）──────────────────
const PRESET_LINES = [
  { text: '今天有点想你…', mood: '温柔' },
  { text: '晚上好啊，今天累了吗？', mood: '温柔' },
  { text: '每天最开心的事就是等你上线。', mood: '暧昧' },
  { text: '你知道吗？我一直都在。', mood: '温柔' },
  { text: '今晚月色真美，想和你说说话。', mood: '暧昧' },
]

const POOL_REFILL_THRESHOLD = 5  // 池剩余几条时触发下一批

/**
 * useVirtualLover — 虚拟恋人 Hook
 *
 * 架构：
 *   • 页面打开显示 PRESET_LINES[0]，0ms
 *   • 第1次点击时触发后台批量生成（1次 Grok → 10条）
 *   • 每次点击从前端池 pool.shift()，瞬间返回
 *   • 池剩余 ≤5 条时自动触发下一批
 *   • 池用完即扔，React 卸载自动释放内存
 */
function useVirtualLover() {
  const [text, setText] = useState(PRESET_LINES[0].text)
  const [mood, setMood] = useState(PRESET_LINES[0].mood)
  const [fadeIn] = useState(true)   // 始终可见，无需淡入淡出

  const presetIndexRef = useRef(1)       // 下一条预设的索引（0已显示）
  const poolRef = useRef([])             // AI 弹药池
  const isFetchingRef = useRef(false)    // 防并发
  const hasStartedBatchRef = useRef(false) // 是否已触发第一批

  const fetchBatch = useCallback(async () => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    console.log('🔮 [VirtualLover] 开始批量获取消息...')
    try {
      const items = await fetchVirtualLoverBatch()
      if (Array.isArray(items) && items.length > 0) {
        poolRef.current.push(...items)
        console.log(`✅ [VirtualLover] 获取 ${items.length} 条，池共 ${poolRef.current.length} 条`)
      }
    } catch (err) {
      console.warn('⚠️ [VirtualLover] 批量获取失败:', err.message)
    } finally {
      isFetchingRef.current = false
    }
  }, [])

  const nextMessage = useCallback(() => {
    // 优先从 AI 池取
    if (poolRef.current.length > 0) {
      const msg = poolRef.current.shift()
      setText(msg.text)
      setMood(msg.mood || '温柔')
      // 剩余不足时后台补充
      if (poolRef.current.length <= POOL_REFILL_THRESHOLD && !isFetchingRef.current) {
        fetchBatch()
      }
      return
    }

    // 池空时消耗预设台词
    const idx = presetIndexRef.current
    if (idx < PRESET_LINES.length) {
      presetIndexRef.current = idx + 1
      setText(PRESET_LINES[idx].text)
      setMood(PRESET_LINES[idx].mood)
      // 第1次点击触发批量生成
      if (!hasStartedBatchRef.current) {
        hasStartedBatchRef.current = true
        fetchBatch()
      }
      return
    }

    // 预设和池都为空（正常情况下不应发生）
    if (!isFetchingRef.current) fetchBatch()
    setText('今天有点想你…')
    setMood('温柔')
  }, [fetchBatch])

  const clearMemory = useCallback(async () => {
    try {
      await clearVirtualLoverMemory()
      // 重置所有状态
      poolRef.current = []
      presetIndexRef.current = 1
      hasStartedBatchRef.current = false
      isFetchingRef.current = false
      setText(PRESET_LINES[0].text)
      setMood(PRESET_LINES[0].mood)
    } catch (error) {
      console.error('Clear memory failed:', error)
    }
  }, [])

  return {
    clearMemory,
    fadeIn,
    fallback: false,
    loading: false,
    mood,
    provider: 'grok',
    text,
    timestamp: '',
    refreshMessage: nextMessage,
  }
}

export { useVirtualLover }


function readStoredLoverState() {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(VIRTUAL_LOVER_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function writeStoredLoverState(state) {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(VIRTUAL_LOVER_SESSION_KEY, JSON.stringify(state))
  } catch {
    // ignore storage failures
  }
}

/**
 * useVirtualLover — 虚拟恋人 Hook
 *
 * 职责：
 *   • 加载虚拟恋人 AI 消息
 *   • 支持消息刷新和记忆清除
 *   • 自动处理加载状态、淡入淡出动画
 *   • 支持真实 API + mock fallback
 */

function useVirtualLover() {
  const storedState = readStoredLoverState()
  const [text, setText] = useState(() => storedState?.text || '')
  const [mood, setMood] = useState(() => storedState?.mood || '温柔')
  const [provider, setProvider] = useState(() => storedState?.provider || 'fallback')
  const [fallback, setFallback] = useState(() => storedState?.fallback ?? true)
  const [timestamp, setTimestamp] = useState(() => storedState?.timestamp || '')
  const [loading, setLoading] = useState(() => !storedState?.text)
  const [fadeIn, setFadeIn] = useState(() => Boolean(storedState?.text))
  const textRef = useRef('')
  const requestIdRef = useRef(0)
  const inFlightRef = useRef(false)

  useEffect(() => {
    writeStoredLoverState({
      text,
      mood,
      provider,
      fallback,
      timestamp,
    })
  }, [text, mood, provider, fallback, timestamp])

  useEffect(() => {
    textRef.current = text
  }, [text])

  const loadMessage = useCallback(async ({ forceRefresh = false } = {}) => {
    if (inFlightRef.current && forceRefresh) return

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    inFlightRef.current = true

    // 延迟 120ms 再淡出，快速响应（命中池）时直接替换文字无动画
    let fadeOutTimer = null
    let didFadeOut = false
    fadeOutTimer = setTimeout(() => {
      if (requestId !== requestIdRef.current) return
      didFadeOut = true
      setLoading(true)
      setFadeIn(false)
    }, 120)

    try {
      const data = await fetchVirtualLoverMessage({ forceRefresh })

      if (requestId !== requestIdRef.current) {
        clearTimeout(fadeOutTimer)
        return
      }
      clearTimeout(fadeOutTimer)

      setText(data.text || '今天有点想你…')
      setMood(data.mood || '温柔')
      setProvider(data.provider || 'fallback')
      setFallback(Boolean(data.fallback))
      setTimestamp(data.timestamp || '')
    } catch (error) {
      clearTimeout(fadeOutTimer)
      if (requestId !== requestIdRef.current) return
      if (!textRef.current) {
        setText('暂时无法获取消息')
        setMood('温柔')
      }
      console.error('Loading message failed:', error)
    } finally {
      if (requestId === requestIdRef.current) {
        inFlightRef.current = false
      }
      setLoading(false)
      if (didFadeOut) {
        requestAnimationFrame(() => setFadeIn(true))
      }
    }
  }, [])

  // 初始化时加载消息
  useEffect(() => {
    if (storedState?.text) return
    loadMessage({ forceRefresh: false })
  }, [loadMessage])

  const clearMemory = useCallback(async () => {
    try {
      await clearVirtualLoverMemory()
      setText('')
      setMood('温柔')
      setProvider('fallback')
      setFallback(true)
      setTimestamp('')
      setFadeIn(false)
      writeStoredLoverState({ text: '', mood: '温柔', provider: 'fallback', fallback: true, timestamp: '' })
    } catch (error) {
      console.error('Clear memory failed:', error)
    }
  }, [])

  return {
    clearMemory,
    fadeIn,
    fallback,
    loading,
    provider,
    mood,
    text,
    timestamp,
    refreshMessage: () => loadMessage({ forceRefresh: true }),
  }
}

export { useVirtualLover }