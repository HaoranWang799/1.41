export async function fetchHealthPlan(payload) {
  const response = await fetch('/api/health/plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('健康计划接口不存在：请重启最新 AI 后端（3100）')
    }
    throw new Error(`健康计划请求失败: ${response.status}`)
  }

  const data = await response.json()
  if (!data?.ok) {
    throw new Error('健康计划返回无效')
  }

  return data
}