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

const POOL_REFILL_THRESHOLD = 5

function useVirtualLover() {
  const [text, setText] = useState(PRESET_LINES[0].text)
  const [mood, setMood] = useState(PRESET_LINES[0].mood)
  const [fadeIn] = useState(true)

  const presetIndexRef = useRef(1)
  const poolRef = useRef([])
  const isFetchingRef = useRef(false)
  const hasStartedBatchRef = useRef(false)

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
    if (poolRef.current.length > 0) {
      const msg = poolRef.current.shift()
      setText(msg.text)
      setMood(msg.mood || '温柔')
      if (poolRef.current.length <= POOL_REFILL_THRESHOLD && !isFetchingRef.current) {
        fetchBatch()
      }
      return
    }

    const idx = presetIndexRef.current
    if (idx < PRESET_LINES.length) {
      presetIndexRef.current = idx + 1
      setText(PRESET_LINES[idx].text)
      setMood(PRESET_LINES[idx].mood)
      if (!hasStartedBatchRef.current) {
        hasStartedBatchRef.current = true
        fetchBatch()
      }
      return
    }

    if (!isFetchingRef.current) fetchBatch()
    setText('今天有点想你…')
    setMood('温柔')
  }, [fetchBatch])

  const clearMemory = useCallback(async () => {
    try {
      await clearVirtualLoverMemory()
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
