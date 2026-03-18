import { useState } from 'react'
import './InputOutline.css'

/**
 * 自定义梗概输入框 - 用于生成长篇音频（模拟）
 * TODO: 接入真实长篇音频生成接口
 */
export default function InputOutline({ onGenerate, disabled }) {
  const [outline, setOutline] = useState('')

  const handleSubmit = () => {
    if (!outline.trim()) return
    onGenerate(outline.trim())
    setOutline('')
  }

  return (
    <div className="input-outline">
      <textarea
        placeholder="输入你想要的剧情梗概，生成专属长篇音频…"
        value={outline}
        onChange={(e) => setOutline(e.target.value)}
        disabled={disabled}
        rows={3}
      />
      <button
        className="outline-btn"
        onClick={handleSubmit}
        disabled={disabled || !outline.trim()}
      >
        生成音频
      </button>
    </div>
  )
}
