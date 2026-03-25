/**
 * usePlanPool.js — 训练计划池 hook
 *
 * 策略：
 *  1. 点击时立即展示一条固定模板（无等待，动画 1700ms）
 *  2. 同时在后台请求 AI 接口
 *  3. AI 返回后自动升级当前方案；若 AI 失败则保留固定模板
 *  4. 每次点击循环切换到下一条固定模板（10 条轮询）
 */
import { useState, useRef } from 'react'
import { seedPlans } from '../data/seedPlans'
import { fetchHealthPlan } from '../api/healthPlan'

const SWITCH_DURATION = 1700 // ms，与 ThinkingState 动画时长对齐

export function usePlanPool(buildPayloadFn) {
  const [currentPlan, setCurrentPlan] = useState(null)
  const [planVisible, setPlanVisible] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const [isFallbackMode, setIsFallbackMode] = useState(false)
  const [isCurrentPlanUpgrading, setIsCurrentPlanUpgrading] = useState(false)

  // 固定模板轮询索引
  const seedIdxRef = useRef(0)

  async function handleGeneratePlan() {
    if (isSwitching) return

    // 1. 取下一条固定模板，立即展示
    const idx = seedIdxRef.current % seedPlans.length
    seedIdxRef.current = idx + 1
    const seedPlan = seedPlans[idx]

    setIsSwitching(true)
    setIsCurrentPlanUpgrading(true)

    // 1700ms 动画结束后展示固定模板
    setTimeout(() => {
      setCurrentPlan(seedPlan)
      setPlanVisible(true)
      setIsSwitching(false)
    }, SWITCH_DURATION)

    // 2. 后台请求 AI（不阻塞 UI）
    try {
      const payload = buildPayloadFn()
      const data = await fetchHealthPlan(payload)
      if (data?.plan) {
        // AI 响应后用真实数据替换（无论动画是否结束）
        setCurrentPlan({ ...data.plan, source: 'ai', _backendSource: data.source || 'grok' })
        setPlanVisible(true)
        setIsFallbackMode(false)
      }
    } catch {
      // AI 失败：保留固定模板，标记降级模式
      setIsFallbackMode(true)
    } finally {
      setIsCurrentPlanUpgrading(false)
    }
  }

  return {
    currentPlan,
    planVisible,
    isSwitching,
    isFallbackMode,
    isCurrentPlanUpgrading,
    handleGeneratePlan,
  }
}
