/**
 * 模拟 API - 仅用于 Demo 演示
 * TODO: Replace with real LLM API
 * TODO: Replace with real Bluetooth API
 * TODO: Replace with real Speech-to-Text API
 * TODO: Replace with real Text-to-Speech API
 */

/**
 * 模拟语音转文字
 * @returns {Promise<string>}
 */
export async function mockSpeechToText() {
  await new Promise((r) => setTimeout(r, 800))
  const phrases = [
    '你今天还好吗？',
    '我想你了…',
    '能陪我说说话吗？',
    '今晚月色真美。',
  ]
  return phrases[Math.floor(Math.random() * phrases.length)]
}

/**
 * 模拟情绪分析
 * @param {string} text
 * @returns {Promise<{emotion: string, level: number}>}
 */
export async function mockEmotionAnalysis(text) {
  await new Promise((r) => setTimeout(r, 400))
  return {
    emotion: '期待',
    level: Math.floor(Math.random() * 3) + 1,
  }
}

/**
 * 模拟 LLM 生成回应
 * @param {string} userInput
 * @param {object} character
 * @param {number} temperature
 * @returns {Promise<string>}
 */
export async function mockLLMResponse(userInput, character, temperature) {
  await new Promise((r) => setTimeout(r, 600))
  const pool = temperature >= 60 ? character.responses.hot : character.responses.warm
  const fallback = character.responses.idle
  const arr = pool?.length ? pool : fallback
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 模拟文字转语音
 * @param {string} text
 * @returns {Promise<void>}
 */
export async function mockTextToSpeech(text) {
  await new Promise((r) => setTimeout(r, 300))
  // 实际可接入 Web Speech API 或 TTS 服务
  console.log('[Mock TTS]', text)
}

/**
 * 模拟蓝牙连接
 * @returns {Promise<boolean>}
 */
export async function mockBluetoothConnect() {
  await new Promise((r) => setTimeout(r, 1000))
  return true
}

/**
 * 模拟设备响应
 * @param {number} level 强度 1-5
 * @returns {Promise<void>}
 */
export async function mockDeviceResponse(level) {
  await new Promise((r) => setTimeout(r, 200))
  console.log('[Mock Device] response level:', level)
}
