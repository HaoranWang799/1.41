import { useCallback, useEffect, useRef, useState } from 'react'
import { clearVirtualLoverMemory, fetchVirtualLoverMessage } from '../api/virtualLover'

function useVirtualLover() {
  const [message, setMessage] = useState('')
  const [mood, setMood] = useState('温柔')
  const [loading, setLoading] = useState(true)
  const [fadeIn, setFadeIn] = useState(false)
  const [metaText, setMetaText] = useState('刚刚')
  const messageRef = useRef('')
  const requestIdRef = useRef(0)
  const inFlightRef = useRef(false)

  useEffect(() => {
    messageRef.current = message
  }, [message])

  const loadMessage = useCallback(async ({ forceRefresh = false } = {}) => {
    if (inFlightRef.current && forceRefresh) return

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    inFlightRef.current = true
    setLoading(true)
    if (forceRefresh) {
      setMetaText('更新中…')
    } else {
      setFadeIn(false)
      setMetaText('刚刚')
    }

    try {
      const data = await fetchVirtualLoverMessage({ forceRefresh })
      if (requestId !== requestIdRef.current) return
      setMessage(data.text || '今天有点想你…')
      setMood(data.mood || '温柔')
      setMetaText(data.source?.includes('forced') ? '刚刚更新' : '刚刚')
    } catch {
      if (requestId !== requestIdRef.current) return
      if (!messageRef.current) {
        setMessage('暂时无法获取消息')
        setMood('温柔')
      }
      setMetaText('连接失败')
    } finally {
      if (requestId === requestIdRef.current) {
        inFlightRef.current = false
      }
      setLoading(false)
      requestAnimationFrame(() => setFadeIn(true))
    }
  }, [])

  useEffect(() => {
    loadMessage({ forceRefresh: false })
  }, [loadMessage])

  return {
    clearMemory: async () => {
      await clearVirtualLoverMemory()
      setMessage('')
      setMood('温柔')
      setMetaText('记忆已清空')
      setFadeIn(false)
    },
    fadeIn,
    loading,
    message,
    metaText,
    mood,
    refreshMessage: () => loadMessage({ forceRefresh: true }),
  }
}

export { useVirtualLover }