import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { scenes } from '../data/scenes'
import {
  INTERACTION_STATE,
  TEMPERATURE_THRESHOLD,
  TEMPERATURE_INCREMENT,
} from '../data/constants'
import {
  mockSpeechToText,
  mockLLMResponse,
  mockDeviceResponse,
} from '../api/mock'
import TypewriterText from '../components/TypewriterText'
import InputOutline from '../components/InputOutline'
import './InteractionPage.css'

function getRandomResponse(char, temperature) {
  const pool =
    temperature >= TEMPERATURE_THRESHOLD ? char.responses.hot : char.responses.warm
  const fallback = char.responses.idle
  const arr = pool?.length ? pool : fallback
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function InteractionPage() {
  const navigate = useNavigate()
  const { selectedCharacter, selectedScene } = useApp()

  const [interactionState, setInteractionState] = useState(INTERACTION_STATE.IDLE)
  const [temperature, setTemperature] = useState(0)
  const [currentResponse, setCurrentResponse] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [deviceConnected] = useState(true) // 模拟已连接
  const [deviceMode] = useState('温和')
  const [deviceLevel, setDeviceLevel] = useState(1)
  const [showDevicePanel, setShowDevicePanel] = useState(false)
  const [generatedAudioText, setGeneratedAudioText] = useState('')

  const sceneStyle = scenes.find((s) => s.id === selectedScene?.id)?.backgroundStyle
  const warmProgress = temperature / 100
  const warmOpacity = Math.min(0.25, warmProgress * 0.4)
  const bgGradient = sceneStyle
    ? `${sceneStyle.gradient}, radial-gradient(ellipse 100% 60% at 50% 100%, rgba(233,69,96,${warmOpacity}) 0%, transparent 60%)`
    : undefined

  const handleMainButton = useCallback(() => {
    if (!selectedCharacter) return

    // 微震动
    if (navigator.vibrate) navigator.vibrate(30)

    if (interactionState === INTERACTION_STATE.IDLE) {
      setInteractionState(INTERACTION_STATE.ACTIVE)
      const msg = selectedCharacter.introLine
      setCurrentResponse(msg)
      setIsTyping(true)
      return
    }

    // ACTIVE 或 AFTER_RESPONSE
    const newTemp = Math.min(100, temperature + TEMPERATURE_INCREMENT)
    setTemperature(newTemp)

    const response = getRandomResponse(selectedCharacter, newTemp)
    setCurrentResponse(response)
    setIsTyping(true)

    if (newTemp >= TEMPERATURE_THRESHOLD) {
      setInteractionState(INTERACTION_STATE.AFTER_RESPONSE)
      setDeviceLevel((l) => Math.min(5, l + 1))
      mockDeviceResponse(deviceLevel + 1)
    }
  }, [interactionState, temperature, selectedCharacter, deviceLevel])

  const handleVoiceClick = useCallback(async () => {
    if (!selectedCharacter || isVoiceActive) return

    setIsVoiceActive(true)
    // TODO: Replace with real Speech-to-Text API
    const userText = await mockSpeechToText()
    // 模拟 1.5 秒情绪识别
    await new Promise((r) => setTimeout(r, 1500))
    // TODO: Replace with real LLM API
    const response = await mockLLMResponse(userText, selectedCharacter, temperature)
    setCurrentResponse(response)
    setIsTyping(true)
    setTemperature((t) => Math.min(100, t + TEMPERATURE_INCREMENT))
    setIsVoiceActive(false)
  }, [selectedCharacter, temperature, isVoiceActive])

  const handleOutlineGenerate = useCallback((outline) => {
    // 模拟生成长篇音频 - 仅展示文案
    // TODO: Replace with real long-form audio generation API
    setGeneratedAudioText(
      `「正在根据你的梗概生成专属音频…」\n\n"${outline}"\n\n${selectedCharacter?.name}：嗯…我懂了。让我为你慢慢讲…`
    )
  }, [selectedCharacter])

  const mainButtonText =
    interactionState === INTERACTION_STATE.IDLE
      ? '轻触开始'
      : temperature >= TEMPERATURE_THRESHOLD
      ? '继续靠近'
      : '再近一点'

  const idleHint =
    interactionState === INTERACTION_STATE.IDLE
      ? '她在等你'
      : currentResponse
      ? ''
      : '她在听你说…'

  return (
    <div
      className="interaction-page"
      style={bgGradient ? { background: bgGradient } : {}}
    >
      {/* 设备连接状态 */}
      <button
        className="device-status"
        onClick={() => setShowDevicePanel(!showDevicePanel)}
      >
        <span className="device-dot" />
        已连接设备（模拟）
      </button>

      {showDevicePanel && (
        <div className="device-panel">
          <p>当前模式：{deviceMode}</p>
          <p>强度等级：{deviceLevel}/5</p>
          {temperature >= TEMPERATURE_THRESHOLD && (
            <p className="device-response">设备响应强度 +1</p>
          )}
        </div>
      )}

      <div className="interaction-content">
        {/* 角色头像 - 呼吸动画 */}
        <div
          className={`avatar-wrap ${interactionState !== INTERACTION_STATE.IDLE ? 'active' : ''}`}
          style={
            temperature >= TEMPERATURE_THRESHOLD
              ? { animation: 'breathe 2s ease-in-out infinite, glow 2s ease-in-out infinite' }
              : {}
          }
        >
          <div className="avatar">{selectedCharacter?.avatar}</div>
        </div>

        {/* 场景描述 */}
        <p className="scene-desc">{selectedScene?.ambientDescription}</p>

        {/* 情绪温度条 */}
        <div className="temperature-wrap">
          <div className="temperature-label">
            <span>情绪温度</span>
            <span>{temperature}</span>
          </div>
          <div className="temperature-bar">
            <div
              className="temperature-fill"
              style={{
                width: `${temperature}%`,
                background:
                  temperature >= TEMPERATURE_THRESHOLD
                    ? `linear-gradient(90deg, #e94560, #ff6b6b)`
                    : `linear-gradient(90deg, #4a5568, #718096)`,
              }}
            />
          </div>
        </div>

        {/* 回应区域 */}
        <div className="response-area">
          {idleHint && !currentResponse && (
            <p className="idle-hint">{idleHint}</p>
          )}
          {currentResponse && (
            <p className="response-text">
              <TypewriterText
                text={currentResponse}
                speed={50}
                onComplete={() => setIsTyping(false)}
              />
            </p>
          )}
        </div>

        {/* 主按钮 */}
        <button
          className={`main-btn ${interactionState} ${temperature >= TEMPERATURE_THRESHOLD ? 'hot' : ''}`}
          onClick={handleMainButton}
        >
          {mainButtonText}
        </button>

        {/* 语音按钮 */}
        <button
          className={`voice-btn ${isVoiceActive ? 'active' : ''}`}
          onClick={handleVoiceClick}
          disabled={isVoiceActive}
        >
          {isVoiceActive ? (
            <>
              <div className="voice-wave">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <span>AI 情绪识别中…</span>
            </>
          ) : (
            <>
              <span className="voice-icon">🎤</span>
              <span>语音对话</span>
            </>
          )}
        </button>

        {/* 自定义梗概输入 */}
        <InputOutline
          onGenerate={handleOutlineGenerate}
          disabled={interactionState === INTERACTION_STATE.IDLE}
        />

        {generatedAudioText && (
          <div className="generated-audio-preview">
            <p>{generatedAudioText}</p>
          </div>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate('/scene')}>
        返回
      </button>
    </div>
  )
}
