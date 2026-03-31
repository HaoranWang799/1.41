import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ArrowLeft, Send } from 'lucide-react'

export default function ChatPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useApp()
  const [inputVal, setInputVal] = useState('')

  const lover = useMemo(() => {
    const fromState = location.state?.lover || {}
    return {
      id: fromState.id || 'default-lover-luna',
      name: fromState.name || 'Luna',
      avatar: fromState.avatar || 'L',
    }
  }, [location.state])

  const storageKey = `ai-lover-chat:${lover.id}`

  const [messages, setMessages] = useState(() => {
    const cached = window.localStorage.getItem(storageKey)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch {
        // ignore invalid cache
      }
    }
    return [{ role: 'ai', text: `主人，${lover.name} 在这，今晚想和我聊点什么？` }]
  })

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(messages))
  }, [messages, storageKey])

  const handleSend = () => {
    const content = inputVal.trim()
    if (!content) return

    const next = [...messages, { role: 'user', text: content }]
    setMessages(next)
    setInputVal('')

    window.setTimeout(() => {
      const reply = `我在听，${content.length > 12 ? '慢慢说给我听。' : '继续说，我很想知道。'}`
      setMessages((prev) => [...prev, { role: 'ai', text: reply }])
    }, 450)
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#FF7DAF]/20 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 text-[#9B859D]">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-base font-bold text-[#F9EDF5]">{lover.name} 专属对话</h1>
        <div className="w-10" />
      </div>

      {/* 消息区 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-end space-x-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7DAF] to-[#A87CFF] flex items-center justify-center text-xs text-white shrink-0">
                {lover.avatar}
              </div>
            )}
            <div className={`${msg.role === 'user' ? 'bg-[#A87CFF]/20 border border-[#A87CFF]/35' : 'bg-[#1E1324]'} text-sm p-3 rounded-2xl text-[#F9EDF5] max-w-[80%] leading-relaxed`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* 输入栏 */}
      <div className="shrink-0 p-4 bg-[#0C060B]">
        <div className="flex bg-[#1E1324] rounded-full p-2 pl-4 items-center">
          <input
            type="text"
            placeholder="发送指令..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend()
            }}
            className="flex-1 bg-transparent outline-none text-sm text-[#F9EDF5] placeholder:text-[#9B859D]"
          />
          <button
            onClick={() => {
              handleSend()
              showToast('消息已发送')
            }}
            className="bg-[#FF7DAF] p-2 rounded-full text-white active:scale-90 transition-transform"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
