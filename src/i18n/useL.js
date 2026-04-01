/**
 * useL — 轻量级双语切换 hook
 *
 * 用法:
 *   const L = useL()
 *   L('中文文本', 'English text')   → 根据全局 lang 返回对应文本
 */
import { useApp } from '../context/AppContext'

export function useL() {
  const { lang } = useApp()
  return (zh, en) => lang === 'en' ? en : zh
}
