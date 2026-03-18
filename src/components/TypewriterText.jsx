import { useState, useEffect } from 'react'

/**
 * 打字机逐字显示组件
 */
export default function TypewriterText({ text, speed = 60, onComplete }) {
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!text) {
      setDisplay('')
      setDone(true)
      onComplete?.()
      return
    }
    setDisplay('')
    setDone(false)
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplay(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
        setDone(true)
        onComplete?.()
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <span>
      {display}
      {!done && <span className="typewriter-cursor">|</span>}
    </span>
  )
}
