/**
 * 情绪状态与互动状态常量
 */

// 互动状态机
export const INTERACTION_STATE = {
  IDLE: 'IDLE',           // 未开始
  ACTIVE: 'ACTIVE',       // 进行中
  AFTER_RESPONSE: 'AFTER_RESPONSE',  // 反馈后（温度 >= 60）
}

// 温度条阈值
export const TEMPERATURE_THRESHOLD = 60

// 每次互动温度增加值
export const TEMPERATURE_INCREMENT = 10
