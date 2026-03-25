/**
 * HealthPage.jsx — 健康数据 v3
 *
 * 新增（v3）：
 *   • 四个指标格（使用时长 / 个人状态 / 内容激烈度 / 硬度评分）均可点击
 *   • 点击弹出 MetricModal：深色半透明背景 + backdrop-blur，居中卡片
 *   • 每个指标有独立的静态模拟详情数据（近7天趋势、分布、对比等）
 *   • 弹窗底部"关闭"按钮，点击遮罩也可关闭
 *
 * 保留（v2）：
 *   • 城市排名卡片（概览卡片下方）
 *   • "🤖 AI分析我的数据"按钮（训练计划区域上方）
 *   • 骨架屏 PlanSkeleton
 *   • "重新生成"按钮
 *
 * 保留（v1）：
 *   • 今日概览：SVG 环形评分 + 指标网格（时长 / 状态 / 硬度 / 激烈度）
 *   • 近 7 天趋势：CSS 柱状图
 *   • 针对性训练计划（饮食 / 运动 / 震动模式）
 *   • 健康小贴士（自动轮播）
 *
 * TODO: 替换为真实硬件传感器数据（/api/device/health）
 * TODO: 接入真实 AI 分析引擎生成个性化建议（/api/ai/health-plan）
 * TODO: 替换柱状图为真实 Chart.js / Recharts 图表
 * TODO: 接入真实运动追踪（Apple HealthKit / Google Fit）
 * TODO: 城市排名接入真实后端排名服务（/api/leaderboard/city）
 */
import { useState, useEffect } from 'react'
import { ChevronRight, Zap, Utensils, Dumbbell, X } from 'lucide-react'
import { usePlanPool } from '../hooks/usePlanPool'

// ═══════════════════════════════════════════════════════════
//  静态数据（未来替换为 API）
// ═══════════════════════════════════════════════════════════

// TODO: 替换为真实硬件传感器采集的数据
const TODAY_STATS = {
  score:      85,
  duration:   '00:23:45',
  status:     '兴奋',       // '兴奋' | '良好' | '疲劳'
  intensity:  '激烈',
  softSecs:   12,           // 疲软期秒数
  hardMin:    8,            // 强硬度分钟
  hardSec:    20,           // 强硬度秒
  hardScore:  'A-',
}

// 近 7 天柱状图数据
// TODO: 替换为真实历史数据（/api/device/history?days=7）
const BAR_DATA = [
  { day: '周一', heightPct: 40,  label: '18m' },
  { day: '周二', heightPct: 65,  label: '28m' },
  { day: '周三', heightPct: 28,  label: '12m' },
  { day: '周四', heightPct: 82,  label: '35m' },
  { day: '周五', heightPct: 55,  label: '24m' },
  { day: '周六', heightPct: 92,  label: '39m' },
  { day: '今天', heightPct: 53,  label: '23m', isToday: true },
]

// ── 各指标弹窗详情数据（静态模拟，未来接入真实 API）────────
// TODO: 替换为 /api/device/metric-detail?type={metricType}&days=7

/** 使用时长：近7天明细 + 统计摘要 */
const DURATION_DETAIL = {
  // TODO: 接入 /api/device/history?days=7 获取每天真实时长
  days: [
    { day: '周一', duration: '18:20', secs: 1100 },
    { day: '周二', duration: '28:05', secs: 1685 },
    { day: '周三', duration: '12:42', secs: 762 },
    { day: '周四', duration: '35:10', secs: 2110 },
    { day: '周五', duration: '24:33', secs: 1473 },
    { day: '周六', duration: '39:08', secs: 2348 },
    { day: '今天', duration: '23:45', secs: 1425, isToday: true },
  ],
  avgDisplay: '25:49',    // 近7天平均
  targetDisplay: '20:00', // 建议目标
  targetNote: '每次 20 分钟以内，有助于保持高质量体验',
}

/** 个人状态：近7天情绪/状态标签 + 分布占比 */
const STATUS_DETAIL = {
  // TODO: 接入 /api/device/status-history?days=7
  days: [
    { day: '周一', status: '良好',  color: 'text-[#7fcb9a]' },
    { day: '周二', status: '兴奋',  color: 'text-[#FF9ACB]' },
    { day: '周三', status: '疲劳',  color: 'text-[#ffa07a]' },
    { day: '周四', status: '兴奋',  color: 'text-[#FF9ACB]' },
    { day: '周五', status: '良好',  color: 'text-[#7fcb9a]' },
    { day: '周六', status: '兴奋',  color: 'text-[#FF9ACB]' },
    { day: '今天', status: '兴奋',  color: 'text-[#FF9ACB]', isToday: true },
  ],
  distribution: [
    { label: '兴奋', count: 4, pct: 57, color: '#FF9ACB' },
    { label: '良好', count: 2, pct: 29, color: '#7fcb9a' },
    { label: '疲劳', count: 1, pct: 14, color: '#ffa07a' },
  ],
}

/** 内容激烈度：近7天评分（1–5星） + 与平均水平对比 */
const INTENSITY_DETAIL = {
  // TODO: 接入 /api/device/intensity-history?days=7
  days: [
    { day: '周一', score: 3, label: '中等' },
    { day: '周二', score: 4, label: '激烈' },
    { day: '周三', score: 2, label: '温和' },
    { day: '周四', score: 5, label: '极烈' },
    { day: '周五', score: 4, label: '激烈' },
    { day: '周六', score: 5, label: '极烈' },
    { day: '今天', score: 4, label: '激烈', isToday: true },
  ],
  myAvg: 3.9,         // 我的平均激烈度分
  platformAvg: 3.1,   // 平台平均（TODO: /api/stats/platform-avg）
  note: '你的内容偏好明显高于平台均值，建议偶尔尝试中低强度内容放松身心',
}

/** 硬度评分：近7天疲软/强硬度记录 + 评级趋势 */
const HARD_DETAIL = {
  // TODO: 接入 /api/device/hardness-history?days=7
  days: [
    { day: '周一', softSecs: 18, hardMin: 6, hardSec: 30, grade: 'B+' },
    { day: '周二', softSecs: 10, hardMin: 9, hardSec: 10, grade: 'A-' },
    { day: '周三', softSecs: 25, hardMin: 4, hardSec: 55, grade: 'B'  },
    { day: '周四', softSecs:  8, hardMin: 11, hardSec: 0, grade: 'A'  },
    { day: '周五', softSecs: 14, hardMin: 7, hardSec: 45, grade: 'B+' },
    { day: '周六', softSecs:  6, hardMin: 12, hardSec: 20, grade: 'A+' },
    { day: '今天', softSecs: 12, hardMin: 8, hardSec: 20, grade: 'A-', isToday: true },
  ],
  trend: '本周整体呈上升趋势，强硬度时间增长 32%，疲软期缩短 15%',
}

// ── 训练计划数据池 ────────────────────────────────────────

// 饮食建议池（3 套随机切换）
// TODO: 接入 AI 引擎根据健康数据动态生成（/api/ai/diet-plan）
const DIET_PLANS = [
  [
    { name: '牡蛎',   benefit: '富含锌，直接提升雄激素水平' },
    { name: '南瓜子', benefit: '高锌高镁，保护前列腺健康' },
    { name: '菠菜',   benefit: '富含镁，促进骨盆血液循环' },
    { name: '黑巧克力', benefit: '含苯乙胺，提升情绪与活力' },
  ],
  [
    { name: '深海鱼', benefit: 'Omega-3，改善血管弹性与血流' },
    { name: '蓝莓',   benefit: '强抗氧化，保护生殖系统细胞' },
    { name: '鳄梨',   benefit: '健康脂肪，平衡激素分泌' },
    { name: '芦笋',   benefit: '含天冬氨酸，提升耐力与精力' },
  ],
  [
    { name: '鸡蛋',   benefit: '优质蛋白与卵磷脂，强化神经反应' },
    { name: '石榴汁', benefit: '抗氧化，改善动脉血流量' },
    { name: '核桃',   benefit: '含精氨酸，促进氧化氮生成' },
    { name: '生姜',   benefit: '提升体温与代谢，增强活力' },
  ],
]

// 运动建议池
const EXERCISE_PLANS = [
  [
    { name: '凯格尔运动',   plan: '每日 3 组，每组 10 次，每次收缩 5 秒' },
    { name: '平板支撑',     plan: '每日 2 组，每组 60 秒，强化核心' },
    { name: '慢跑',         plan: '每周 4 次，每次 30 分钟，中等强度' },
  ],
  [
    { name: '深蹲',         plan: '每日 3 组，每组 15 次，激活骨盆底肌' },
    { name: '游泳',         plan: '每周 3 次，每次 40 分钟，全身有氧' },
    { name: '瑜伽',         plan: '每日 15 分钟，改善骨盆灵活性' },
  ],
  [
    { name: '凯格尔+逆凯格尔', plan: '交替进行，每日 4 组，精准控制训练' },
    { name: '有氧单车',     plan: '每周 5 次，每次 25 分钟，中等强度' },
    { name: '核心卷腹',     plan: '每日 3 组 × 20 次，强化下腹区域' },
  ],
]

// 震动模式建议池
const VIBRATION_MODES = [
  { mode: '低频渐进模式',  desc: '从 2Hz 开始，每 2 分钟递增 1Hz，最高至 8Hz' },
  { mode: '脉冲间歇模式',  desc: '强度 3Hz 持续 10s，停止 5s，循环 8 轮' },
  { mode: '波浪呼吸模式',  desc: '随呼吸节奏缓慢起伏，频率 1–5Hz' },
]

// 健康小贴士
const HEALTH_TIPS = [
  '深度放松有助于提高硬度与持久度',
  '规律作息对性功能有显著正向影响',
  '适量有氧运动可提升体内睾酮水平',
  '保持水分摄入充足，有助于改善整体状态',
  '减少久坐时间，每小时起身活动 5 分钟',
  '高质量睡眠是最好的自然恢复方式',
]

// AI 分析思考步骤文案（每步持续约 0.75s，共 4 步 = 3s）
// TODO: 替换为真实 AI 流式输出的分析日志（/api/ai/health-plan/stream）
const THINKING_STEPS = [
  '分析你的使用数据中...',
  '检测到近期时长下降 15%...',
  '评估激素水平与训练状态...',
  '生成个性化训练方案...',
]

function buildHealthPlanPayload() {
  return {
    todayStats: TODAY_STATS,
    weeklyTrend: BAR_DATA,
    detailSummary: {
      avgDuration: DURATION_DETAIL.avgDisplay,
      statusDistribution: STATUS_DETAIL.distribution
        .map((item) => `${item.label}${item.pct}%`)
        .join('、'),
      myAvgIntensity: INTENSITY_DETAIL.myAvg,
      platformAvgIntensity: INTENSITY_DETAIL.platformAvg,
      hardTrend: HARD_DETAIL.trend,
    },
  }
}

// ═══════════════════════════════════════════════════════════
//  弹窗内容组件（每个指标独立渲染）
// ═══════════════════════════════════════════════════════════

/** 星级显示（1–5）*/
function Stars({ score, max = 5 }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`text-[11px] ${i < score ? 'text-[#FF9ACB]' : 'text-[rgba(255,255,255,0.15)]'}`}>★</span>
      ))}
    </span>
  )
}

/** 使用时长详情内容 */
function DurationModalContent() {
  const maxSecs = Math.max(...DURATION_DETAIL.days.map((d) => d.secs))
  return (
    <div className="space-y-4">
      {/* 近7天列表 + 迷你横向进度条 */}
      {/* TODO: 接入 /api/device/history?days=7 替换静态数据 */}
      <div className="space-y-2">
        {DURATION_DETAIL.days.map((d) => (
          <div key={d.day} className="flex items-center gap-2">
            <span className={`text-[10px] w-7 flex-shrink-0 ${d.isToday ? 'text-[#FF9ACB] font-bold' : 'text-[rgba(245,240,242,0.5)]'}`}>
              {d.day}
            </span>
            <div className="flex-1 h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(d.secs / maxSecs) * 100}%`,
                  background: d.isToday
                    ? 'linear-gradient(90deg, #FF9ACB, #B380FF)'
                    : 'rgba(179,128,255,0.45)',
                }}
              />
            </div>
            <span className={`text-[10px] w-11 text-right flex-shrink-0 ${d.isToday ? 'text-[#FF9ACB] font-semibold' : 'text-[rgba(245,240,242,0.5)]'}`}>
              {d.duration}
            </span>
          </div>
        ))}
      </div>
      {/* 统计摘要 */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
        <div className="rounded-xl p-3 bg-[rgba(255,255,255,0.04)] text-center">
          <p className="text-[9px] text-[rgba(245,240,242,0.4)] mb-1">近7天平均</p>
          <p className="text-sm font-bold text-[rgba(245,240,242,0.9)]">{DURATION_DETAIL.avgDisplay}</p>
        </div>
        <div className="rounded-xl p-3 bg-[rgba(255,255,255,0.04)] text-center">
          <p className="text-[9px] text-[rgba(245,240,242,0.4)] mb-1">建议目标</p>
          <p className="text-sm font-bold text-[#7fcb9a]">{DURATION_DETAIL.targetDisplay}</p>
        </div>
      </div>
      <p className="text-[10px] text-[rgba(245,240,242,0.4)] leading-relaxed">
        💡 {DURATION_DETAIL.targetNote}
      </p>
    </div>
  )
}

/** 个人状态详情内容 */
function StatusModalContent() {
  return (
    <div className="space-y-4">
      {/* 近7天状态标签 */}
      {/* TODO: 接入 /api/device/status-history?days=7 */}
      <div className="grid grid-cols-7 gap-1">
        {STATUS_DETAIL.days.map((d) => (
          <div key={d.day} className="flex flex-col items-center gap-1.5">
            <span className={`text-[9px] font-semibold ${d.color}`}>{d.status}</span>
            <div
              className="w-1.5 h-8 rounded-full"
              style={{
                background: d.isToday ? '#FF9ACB' : 'rgba(255,255,255,0.1)',
                opacity: d.isToday ? 1 : 0.7,
              }}
            />
            <span className={`text-[8px] ${d.isToday ? 'text-[#FF9ACB] font-bold' : 'text-[rgba(245,240,242,0.35)]'}`}>
              {d.day}
            </span>
          </div>
        ))}
      </div>
      {/* 状态分布 */}
      <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] space-y-2">
        <p className="text-[10px] text-[rgba(245,240,242,0.4)] tracking-wider">近7天状态分布</p>
        {STATUS_DETAIL.distribution.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-[10px] w-6 font-medium" style={{ color: item.color }}>{item.label}</span>
            <div className="flex-1 h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${item.pct}%`, background: item.color }}
              />
            </div>
            <span className="text-[10px] text-[rgba(245,240,242,0.4)] w-8 text-right">{item.pct}%</span>
            <span className="text-[9px] text-[rgba(245,240,242,0.3)]">{item.count}次</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 内容激烈度详情内容 */
function IntensityModalContent() {
  return (
    <div className="space-y-4">
      {/* 近7天星级 */}
      {/* TODO: 接入 /api/device/intensity-history?days=7 */}
      <div className="space-y-2">
        {INTENSITY_DETAIL.days.map((d) => (
          <div key={d.day} className="flex items-center gap-3">
            <span className={`text-[10px] w-7 flex-shrink-0 ${d.isToday ? 'text-[#FF9ACB] font-bold' : 'text-[rgba(245,240,242,0.5)]'}`}>
              {d.day}
            </span>
            <Stars score={d.score} />
            <span className={`text-[10px] ${d.isToday ? 'text-[#FF9ACB]' : 'text-[rgba(179,128,255,0.7)]'}`}>
              {d.label}
            </span>
          </div>
        ))}
      </div>
      {/* 与平台平均对比 */}
      {/* TODO: 接入 /api/stats/platform-avg 获取真实平台均值 */}
      <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] space-y-2">
        <p className="text-[10px] text-[rgba(245,240,242,0.4)] tracking-wider">与平台平均对比</p>
        <div className="flex items-end gap-6 justify-center py-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-10 rounded-t-lg"
              style={{
                height: `${(INTENSITY_DETAIL.myAvg / 5) * 60}px`,
                background: 'linear-gradient(180deg, #FF9ACB, #B380FF)',
              }}
            />
            <span className="text-[10px] font-bold text-[#FF9ACB]">{INTENSITY_DETAIL.myAvg}</span>
            <span className="text-[9px] text-[rgba(245,240,242,0.4)]">我的均值</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-10 rounded-t-lg"
              style={{
                height: `${(INTENSITY_DETAIL.platformAvg / 5) * 60}px`,
                background: 'rgba(255,255,255,0.12)',
              }}
            />
            <span className="text-[10px] font-bold text-[rgba(245,240,242,0.5)]">{INTENSITY_DETAIL.platformAvg}</span>
            <span className="text-[9px] text-[rgba(245,240,242,0.4)]">平台均值</span>
          </div>
        </div>
        <p className="text-[10px] text-[rgba(245,240,242,0.4)] leading-relaxed">
          💡 {INTENSITY_DETAIL.note}
        </p>
      </div>
    </div>
  )
}

/** 硬度评分详情内容 */
function HardScoreModalContent() {
  return (
    <div className="space-y-4">
      {/* 近7天疲软/强硬度明细 */}
      {/* TODO: 接入 /api/device/hardness-history?days=7 */}
      <div className="space-y-2">
        {HARD_DETAIL.days.map((d) => (
          <div key={d.day} className="flex items-center gap-2 rounded-xl p-2 bg-[rgba(255,255,255,0.03)]">
            <span className={`text-[10px] w-7 flex-shrink-0 ${d.isToday ? 'text-[#FF9ACB] font-bold' : 'text-[rgba(245,240,242,0.5)]'}`}>
              {d.day}
            </span>
            <div className="flex-1 flex items-center gap-3 text-[9px]">
              <div>
                <span className="text-[rgba(245,240,242,0.35)]">疲软期 </span>
                <span className="text-[rgba(245,240,242,0.7)] font-medium">{d.softSecs}s</span>
              </div>
              <div className="w-px h-4 bg-[rgba(255,255,255,0.1)]" />
              <div>
                <span className="text-[rgba(245,240,242,0.35)]">强硬 </span>
                <span className="text-[rgba(245,240,242,0.7)] font-medium">{d.hardMin}m{d.hardSec}s</span>
              </div>
            </div>
            <span className={`text-[11px] font-bold flex-shrink-0 w-7 text-right ${
              d.grade.startsWith('A') ? 'text-[#FF9ACB]' : 'text-[rgba(179,128,255,0.8)]'
            }`}>
              {d.grade}
            </span>
          </div>
        ))}
      </div>
      {/* 趋势描述 */}
      <div className="rounded-xl p-3 pt-2 border-t border-[rgba(255,255,255,0.06)]">
        <p className="text-[10px] text-[rgba(245,240,242,0.4)] mb-1 tracking-wider">评分趋势</p>
        <p className="text-[11px] text-[rgba(245,240,242,0.75)] leading-relaxed">
          📈 {HARD_DETAIL.trend}
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  指标弹窗（通用容器）
// ═══════════════════════════════════════════════════════════

/**
 * MetricModal — 指标详情弹窗
 * @param {string}   metric   - 'duration' | 'status' | 'intensity' | 'hardScore' | null
 * @param {function} onClose  - 关闭回调
 */
function MetricModal({ metric, onClose }) {
  if (!metric) return null

  const MODAL_CONFIG = {
    duration:  { title: '使用时长详情',   subtitle: '近 7 天时长明细',   content: <DurationModalContent /> },
    status:    { title: '个人状态详情',   subtitle: '近 7 天状态变化',   content: <StatusModalContent /> },
    intensity: { title: '内容激烈度详情', subtitle: '近 7 天激烈度评分', content: <IntensityModalContent /> },
    hardScore: { title: '硬度评分详情',   subtitle: '近 7 天疲软 / 强硬度记录', content: <HardScoreModalContent /> },
  }

  const { title, subtitle, content } = MODAL_CONFIG[metric]

  return (
    /* 遮罩层：点击遮罩关闭 */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(5,3,5,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      {/* 卡片容器：点击内部不关闭 */}
      <div
        className="w-full max-w-[430px] rounded-t-3xl p-5 pb-8 max-h-[82vh] overflow-y-auto"
        style={{ background: 'linear-gradient(160deg, #1e1228, #251840)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部拖拽条 */}
        <div className="w-10 h-1 rounded-full bg-[rgba(255,255,255,0.15)] mx-auto mb-5" />

        {/* 标题行 */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-sm font-semibold text-[rgba(245,240,242,0.95)]">{title}</h3>
            <p className="text-[10px] text-[rgba(245,240,242,0.4)] mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.08)] flex items-center justify-center flex-shrink-0 ml-3"
          >
            <X size={13} className="text-[rgba(245,240,242,0.5)]" />
          </button>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-[rgba(255,255,255,0.06)] my-3" />

        {/* 动态内容区 */}
        <div className="animate-fadeUp">
          {content}
        </div>

        {/* 底部关闭按钮 */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-2xl text-[12px] font-medium text-[rgba(245,240,242,0.6)] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] active:scale-[0.98] transition-all"
        >
          关闭
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  子组件
// ═══════════════════════════════════════════════════════════

/** SVG 环形评分 */
function ScoreRing({ score }) {
  const R    = 46
  const CIRC = 2 * Math.PI * R          // ≈ 289
  const offset = CIRC * (1 - score / 100)

  return (
    <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
      <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
        {/* 底圈 */}
        <circle cx="56" cy="56" r={R} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        {/* 进度圈 */}
        <circle cx="56" cy="56" r={R} fill="none"
          stroke="url(#scoreGrad)" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#FF9ACB" />
            <stop offset="100%" stopColor="#B380FF" />
          </linearGradient>
        </defs>
      </svg>
      {/* 中心文字 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[rgba(245,240,242,0.95)]">{score}</span>
        <span className="text-[9px] text-[rgba(245,240,242,0.45)] tracking-wider">综合评分</span>
      </div>
    </div>
  )
}

/**
 * 指标小格（可点击）
 * onClick 由父组件注入，点击后打开对应弹窗
 */
function MetricCell({ label, value, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl p-2.5 bg-[rgba(255,255,255,0.04)] text-center cursor-pointer
                 active:scale-95 transition-transform hover:bg-[rgba(255,255,255,0.07)] w-full"
    >
      <p className="text-[9px] text-[rgba(245,240,242,0.4)] mb-1">{label}</p>
      <p className={`text-xs font-bold ${color ?? 'text-[rgba(245,240,242,0.85)]'}`}>{value}</p>
      {sub && <p className="text-[9px] text-[rgba(245,240,242,0.35)] mt-0.5">{sub}</p>}
      {/* 点击提示小箭头 */}
      <p className="text-[8px] text-[rgba(179,128,255,0.45)] mt-1">详情 ›</p>
    </button>
  )
}

/** 单条建议行 */
function PlanRow({ icon: Icon, title, sub, onDetail }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[rgba(255,255,255,0.04)] last:border-0">
      <div className="w-8 h-8 rounded-xl bg-[rgba(255,154,203,0.1)] flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-[#FF9ACB]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-[rgba(245,240,242,0.85)] truncate">{title}</p>
        <p className="text-[10px] text-[rgba(245,240,242,0.45)] leading-relaxed">{sub}</p>
      </div>
      <button
        onClick={onDetail}
        className="flex-shrink-0 flex items-center gap-0.5 text-[10px] text-[rgba(179,128,255,0.6)] hover:text-[#B380FF] transition-colors"
      >
        详情 <ChevronRight size={11} />
      </button>
    </div>
  )
}

/**
 * AI 思考状态（显示旋转图标 + 动态步骤文案）
 * @param {number} step - 当前思考步骤索引（0–3）
 */
function ThinkingState({ step }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-4 animate-fadeUp">
      {/* 旋转加载圈 */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border-2 border-[rgba(179,128,255,0.15)] border-t-[#B380FF]"
          style={{ animation: 'spin 1s linear infinite' }}
        />
        <span className="text-2xl select-none">🤖</span>
      </div>
      {/* 当前步骤文案 */}
      <div className="text-center space-y-1">
        <p
          key={step}
          className="text-[12px] text-[#B380FF] font-medium animate-fadeUp"
        >
          {THINKING_STEPS[step]}
        </p>
        {/* 步骤点指示器 */}
        <div className="flex gap-1.5 justify-center mt-2">
          {THINKING_STEPS.map((_, i) => (
            <span
              key={i}
              className="inline-block h-1 rounded-full transition-all duration-300"
              style={{
                width: i === step ? '12px' : '4px',
                background: i <= step ? '#B380FF' : 'rgba(179,128,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  主组件
// ═══════════════════════════════════════════════════════════

export default function HealthPage() {
  // ── 方案池（替代旧的单次 AI 请求） ──────────────────────
  const {
    currentPlan,
    planVisible,
    isSwitching,
    isFallbackMode,
    isCurrentPlanUpgrading,
    handleGeneratePlan,
  } = usePlanPool(buildHealthPlanPayload)

  // ── 切换动画期间循环切换 ThinkingState 步骤 ────────────
  const [thinkingStep, setThinkingStep] = useState(0)
  useEffect(() => {
    if (!isSwitching) { setThinkingStep(0); return }
    // 1700ms 动画内均匀切换所有步骤
    const ticker = setInterval(() => {
      setThinkingStep((s) => (s + 1) % THINKING_STEPS.length)
    }, Math.floor(1700 / THINKING_STEPS.length))
    return () => clearInterval(ticker)
  }, [isSwitching])

  // ── 健康小贴士轮播 ──────────────────────────────────────
  const [tipIdx, setTipIdx] = useState(0)
  const activeTips = Array.from(
    new Set([...(currentPlan?.recoveryTips || []), ...HEALTH_TIPS])
  ).slice(0, 6)
  const tipCount = 6

  useEffect(() => {
    setTipIdx(0)
    if (tipCount <= 1) return undefined
    const t = setInterval(() => {
      setTipIdx((i) => (i + 1) % tipCount)
    }, 4000)
    return () => clearInterval(t)
  }, [tipCount])

  // ── 当前计划数据 ─────────────────────────────────────────
  const diet     = currentPlan?.dietSuggestions     || []
  const exercise = currentPlan?.exerciseSuggestions || []
  const vib      = currentPlan?.vibrationSuggestion || null

  // ── 指标弹窗状态 ─────────────────────────────────────────
  // activeMetric: 'duration' | 'status' | 'intensity' | 'hardScore' | null
  // TODO: 弹窗数据未来可从 /api/device/metric-detail?type={activeMetric} 动态拉取
  const [activeMetric, setActiveMetric] = useState(null)

  // ── 分享战绩弹窗状态 ─────────────────────────────────────
  const [showShareModal, setShowShareModal] = useState(false)

  // ── 当前计划数据 ─────────────────────────────────────────
  return (
    <div className="px-4 pt-4 pb-8 space-y-5">

      {/* ═══ 今日概览卡片 ════════════════════════════════════ */}
      {/* TODO: 替换为真实硬件传感器数据（蓝牙 / 健康 SDK） */}
      <section
        className="rounded-2xl p-4 card-glow"
        style={{ background: 'linear-gradient(145deg, #1e1028, #251840)' }}
      >
        <p className="text-[10px] text-[rgba(245,240,242,0.4)] tracking-wider mb-3">本次使用状态</p>

        {/* 环形评分 + 右侧可点击指标格 */}
        <div className="flex items-center gap-4 mb-4">
          <ScoreRing score={TODAY_STATS.score} />
          <div className="flex-1 grid grid-cols-2 gap-2">
            {/* 使用时长 — 点击打开弹窗 */}
            <MetricCell
              label="使用时长"
              value={TODAY_STATS.duration}
              color="text-[rgba(245,240,242,0.9)]"
              onClick={() => setActiveMetric('duration')}
            />
            {/* 个人状态 — 点击打开弹窗 */}
            <MetricCell
              label="个人状态"
              value={TODAY_STATS.status}
              color={
                TODAY_STATS.status === '兴奋' ? 'text-[#FF9ACB]' :
                TODAY_STATS.status === '良好' ? 'text-[#7fcb9a]' :
                'text-[#ffa07a]'
              }
              onClick={() => setActiveMetric('status')}
            />
            {/* 内容激烈度 — 点击打开弹窗 */}
            <MetricCell
              label="内容激烈度"
              value={TODAY_STATS.intensity}
              color="text-[#B380FF]"
              onClick={() => setActiveMetric('intensity')}
            />
            {/* 硬度评分 — 点击打开弹窗 */}
            <MetricCell
              label="硬度评分"
              value={TODAY_STATS.hardScore}
              color="text-[#FF9ACB]"
              onClick={() => setActiveMetric('hardScore')}
            />
          </div>
        </div>

        {/* 硬度监控详情 */}
        <div
          className="rounded-xl p-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <Zap size={14} className="text-[#FF9ACB] flex-shrink-0" />
          <div className="flex-1 flex items-center gap-4 text-[10px]">
            <div>
              <p className="text-[rgba(245,240,242,0.4)]">疲软期</p>
              <p className="font-semibold text-[rgba(245,240,242,0.8)]">{TODAY_STATS.softSecs}s</p>
            </div>
            <div className="w-px h-6 bg-[rgba(255,255,255,0.1)]" />
            <div>
              <p className="text-[rgba(245,240,242,0.4)]">强硬度时间</p>
              <p className="font-semibold text-[rgba(245,240,242,0.8)]">
                {TODAY_STATS.hardMin}m {TODAY_STATS.hardSec}s
              </p>
            </div>
            <div className="w-px h-6 bg-[rgba(255,255,255,0.1)]" />
            <div>
              <p className="text-[rgba(245,240,242,0.4)]">综合评级</p>
              <p className="font-bold text-[#FF9ACB]">{TODAY_STATS.hardScore}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 亚洲猛男榜排名卡片 ══════════════════════════════ */}
      {/* TODO: 替换为真实后端排名服务（/api/leaderboard/global） */}
      <section>
        <div className="bg-white/5 rounded-2xl p-5">
          {/* 全国排名 */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">💪</span>
            <div>
              <div className="text-2xl font-bold text-[rgba(245,240,242,0.95)]">亚洲猛男榜</div>
              <div
                className="text-3xl font-bold tabular-nums"
                style={{
                  background: 'linear-gradient(135deg, #FF9ACB, #B380FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                第 12,345 位
              </div>
              <div className="text-sm text-[rgba(245,240,242,0.5)] mt-0.5">击败全国 98% 的猛男</div>
            </div>
          </div>
          {/* 城市 + 好友排名 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-3 bg-[rgba(255,154,203,0.06)] border border-[rgba(255,154,203,0.1)] text-center">
              <p className="text-[9px] text-[rgba(245,240,242,0.4)] mb-1 tracking-wider">本城排名</p>
              <p className="text-sm font-bold" style={{ background: 'linear-gradient(135deg, #FF9ACB, #B380FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>北京 第 888 名</p>
              <p className="text-[10px] text-[rgba(245,240,242,0.4)] mt-0.5">城市前 2%</p>
            </div>
            <div className="rounded-xl p-3 bg-[rgba(179,128,255,0.06)] border border-[rgba(179,128,255,0.1)] text-center">
              <p className="text-[9px] text-[rgba(245,240,242,0.4)] mb-1 tracking-wider">好友排名</p>
              <p className="text-sm font-bold" style={{ background: 'linear-gradient(135deg, #B380FF, #FF9ACB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>超越 92%</p>
              <p className="text-[10px] text-[rgba(245,240,242,0.4)] mt-0.5">的好友</p>
            </div>
          </div>
        </div>

        {/* 激励文案 */}
        <div className="mt-3 rounded-xl p-3" style={{ background: 'linear-gradient(135deg, rgba(255,154,203,0.06), rgba(179,128,255,0.06))', border: '1px solid rgba(255,154,203,0.1)' }}>
          <p className="text-[11px] text-center font-medium leading-relaxed" style={{ background: 'linear-gradient(135deg, #FF9ACB, #B380FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🔥 实力已证明——你不只是参与者，你是今晚的王者
          </p>
          <p className="text-[10px] text-center text-[rgba(245,240,242,0.35)] mt-1">继续保持，王座只属于你</p>
        </div>

        {/* 生成分享卡片按钮 */}
        <button
          onClick={() => setShowShareModal(true)}
          className="mt-3 px-6 py-3 rounded-full font-medium w-full text-sm active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(90deg, #FF9ACB, #B380FF)', color: '#1a0a12' }}
        >
          📸 生成猛男战绩分享卡
        </button>
      </section>

      {/* ═══ 近 7 天趋势柱状图 ═══════════════════════════════ */}
      {/* TODO: 替换为 Recharts 或 Chart.js 真实图表组件 */}
      <section className="rounded-2xl p-4 card-glow bg-[rgba(30,20,25,0.6)]">
        <p className="text-sm font-semibold text-[rgba(245,240,242,0.8)] mb-4">近 7 天趋势</p>
        <div className="flex items-end justify-between h-24 gap-1.5">
          {BAR_DATA.map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5">
              {/* 时长标签 */}
              <span className={`text-[8px] ${bar.isToday ? 'text-[#FF9ACB]' : 'text-[rgba(245,240,242,0.35)]'}`}>
                {bar.label}
              </span>
              {/* 柱体 */}
              <div
                className="w-full rounded-t-lg transition-all duration-700"
                style={{
                  height: `${(bar.heightPct / 100) * 60}px`,
                  background: bar.isToday
                    ? 'linear-gradient(180deg, #FF9ACB, #d96fa8)'
                    : 'linear-gradient(180deg, rgba(179,128,255,0.6), rgba(179,128,255,0.2))',
                }}
              />
              {/* 星期标签 */}
              <span className={`text-[8px] ${bar.isToday ? 'text-[#FF9ACB] font-bold' : 'text-[rgba(245,240,242,0.35)]'}`}>
                {bar.day}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 针对性训练计划 ══════════════════════════════════ */}
      <section className="rounded-2xl p-4 card-glow bg-[rgba(30,20,25,0.6)]">
        {/* 标题（已移除"重新生成"按钮，统一由 AI 按钮触发） */}
        <p className="text-sm font-semibold text-[rgba(245,240,242,0.8)] mb-3">针对性训练计划</p>

        {/* ── AI 分析按钮（唯一触发入口）────────────────────── */}
        {/* TODO: 替换为真实 AI 分析 API（/api/ai/health-plan） */}
        <button
          onClick={handleGeneratePlan}
          disabled={isSwitching}
          className={`
            w-full mb-4 py-3 rounded-2xl flex items-center justify-center gap-2.5
            text-sm font-medium transition-all active:scale-[0.98]
            ${isSwitching
              ? 'bg-[rgba(179,128,255,0.1)] text-[rgba(179,128,255,0.5)] cursor-not-allowed'
              : 'bg-[rgba(179,128,255,0.12)] text-[#B380FF] border border-[rgba(179,128,255,0.2)] hover:bg-[rgba(179,128,255,0.18)]'
            }
          `}
        >
          {isSwitching ? (
            <>
              <span
                className="w-4 h-4 rounded-full border-2 border-[rgba(179,128,255,0.3)] border-t-[#B380FF]"
                style={{ animation: 'spin 0.8s linear infinite' }}
              />
              AI 思考中…
            </>
          ) : (
            <>🤖 AI分析&amp;智能生成训练计划</>
          )}
        </button>

        {/* ── 计划内容区三态：思考中 / 占位提示 / 计划内容 ── */}
        {isSwitching ? (
          /* 思考动画（1.5s，每 375ms 切换一条文案） */
          <ThinkingState step={thinkingStep} />
        ) : !planVisible ? (
          /* 占位提示：初始状态 & 重新生成前的空态 */
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center animate-fadeUp">
            <span className="text-4xl select-none">✨</span>
            <p className="text-[12px] text-[rgba(245,240,242,0.45)] leading-relaxed">
              {isFallbackMode ? '网络异常，已切换本地模板' : '点击上方按钮'}<br />AI 将根据你的健康数据生成专属训练计划
            </p>
          </div>
        ) : (
          <>
            {/* AI 总结 */}
            <div className="mb-3 rounded-xl p-3 bg-[rgba(179,128,255,0.08)] border border-[rgba(179,128,255,0.12)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold text-[rgba(245,240,242,0.85)]">AI 分析结论</p>
                {/* 来源徽章 */}
                {(() => {
                  const bs = currentPlan?._backendSource
                  const isFixed = currentPlan?.source === 'fixed'
                  if (isCurrentPlanUpgrading)
                    return <span className="text-[9px] px-2 py-0.5 rounded-full bg-[rgba(100,255,150,0.1)] text-[rgba(100,255,150,0.75)]">AI 优化中…</span>
                  if (isFixed)
                    return <span className="text-[9px] px-2 py-0.5 rounded-full bg-[rgba(100,255,150,0.1)] text-[rgba(100,255,150,0.75)]">✓ AI分析</span>
                  if (bs === 'grok' || bs === 'cache')
                    return <span className="text-[9px] px-2 py-0.5 rounded-full bg-[rgba(100,255,150,0.1)] text-[rgba(100,255,150,0.75)]">✓ AI 生成</span>
                  return <span className="text-[9px] px-2 py-0.5 rounded-full bg-[rgba(100,255,150,0.1)] text-[rgba(100,255,150,0.75)]">✓ AI分析</span>
                })()}
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[rgba(245,240,242,0.62)]">
                {currentPlan?.summary}
              </p>
            </div>

            {/* 饮食建议 */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Utensils size={12} className="text-[rgba(245,240,242,0.4)]" />
                <p className="text-[10px] text-[rgba(245,240,242,0.45)] tracking-wider">饮食建议 — {currentPlan?.dietFocus}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {diet.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-xl p-2.5 bg-[rgba(255,255,255,0.04)] flex flex-col gap-1"
                  >
                    <p className="text-[11px] font-semibold text-[rgba(245,240,242,0.85)]">{item.name}</p>
                    <p className="text-[9px] text-[rgba(245,240,242,0.4)] leading-relaxed">{item.benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 分隔线 */}
            <div className="border-t border-[rgba(255,255,255,0.05)] my-3" />

            {/* 运动建议 */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Dumbbell size={12} className="text-[rgba(245,240,242,0.4)]" />
                <p className="text-[10px] text-[rgba(245,240,242,0.45)] tracking-wider">运动建议</p>
              </div>
              <div className="space-y-0">
                {exercise.map((item) => (
                  <PlanRow
                    key={item.name}
                    icon={Dumbbell}
                    title={item.name}
                    sub={item.plan}
                    onDetail={() => alert(`📋 ${item.name}\n${item.plan}\n\n推荐原因：${item.reason || '根据你的近期数据匹配该训练。'}`)}
                  />
                ))}
              </div>
            </div>

            {/* 分隔线 */}
            <div className="border-t border-[rgba(255,255,255,0.05)] my-3" />

            {/* 震动频率建议 */}
            {/* TODO: 替换为真实设备震动控制接口（connectToy, setVibrationMode） */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Zap size={12} className="text-[rgba(245,240,242,0.4)]" />
                <p className="text-[10px] text-[rgba(245,240,242,0.45)] tracking-wider">下次震动频率建议</p>
              </div>
              {vib && (
                <div
                  className="rounded-xl p-3 flex items-center gap-3"
                  style={{ background: 'linear-gradient(135deg, rgba(255,154,203,0.08), rgba(179,128,255,0.08))' }}
                >
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#FF9ACB] mb-0.5">{vib.mode}</p>
                    <p className="text-[10px] text-[rgba(245,240,242,0.5)] leading-relaxed">{vib.desc}</p>
                  </div>
                  <button
                    onClick={() => alert(`🎛️ 震动模式：${vib.mode}\n${vib.desc}\n\n推荐原因：${vib.reason || '已结合你的近期状态和训练目标调整。'}`)}
                    className="flex-shrink-0 flex items-center gap-1 text-[10px] text-[rgba(179,128,255,0.6)] hover:text-[#B380FF] transition-colors"
                  >
                    详情 <ChevronRight size={11} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* ═══ 健康小贴士（自动轮播 + 点击切换） ════════════ */}
      {/* TODO: 替换为 AI 生成的个性化贴士（/api/health/tips） */}
      <section
        className="rounded-2xl p-4 card-glow flex items-start gap-3 cursor-pointer select-none active:scale-[0.99] transition-transform"
        style={{ background: 'linear-gradient(135deg, #1a1028, #1e1528)' }}
        onClick={() => {
          if (tipCount <= 1) return
          setTipIdx((i) => (i + 1) % tipCount)
        }}
      >
        <span className="text-lg flex-shrink-0 mt-0.5">💡</span>
        <div className="flex-1">
          <p className="text-[10px] text-[rgba(245,240,242,0.35)] mb-1 tracking-wider">健康小贴士</p>
          <p
            key={tipIdx}           /* key 变化时触发 animate-fadeUp 重播 */
            className="text-[12px] text-[rgba(245,240,242,0.75)] leading-relaxed animate-fadeUp"
          >
            {activeTips[tipIdx]}
          </p>
          {/* 小圆点指示器（固定 6 个） */}
          <div className="flex gap-1 mt-2">
            {Array.from({ length: tipCount }).map((_, i) => (
              <span
                key={i}
                className={`inline-block h-1 rounded-full transition-all ${
                  i === tipIdx ? 'w-3 bg-[#FF9ACB]' : 'w-1 bg-[rgba(255,255,255,0.15)]'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 指标详情弹窗（Portal 式全屏遮罩） ══════════════ */}
      {/* TODO: 弹窗数据改为从 /api/device/metric-detail?type={activeMetric} 动态拉取 */}
      <MetricModal
        metric={activeMetric}
        onClose={() => setActiveMetric(null)}
      />

      {/* ═══ 猛男战绩分享卡弹窗 ══════════════════════════════ */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(5,3,5,0.80)', backdropFilter: 'blur(10px)' }}
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="w-full max-w-[340px] rounded-3xl p-6 animate-fadeUp"
            style={{ background: 'linear-gradient(145deg, #1e1028, #2a1840)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部拖拽条 */}
            <div className="w-10 h-1 rounded-full bg-[rgba(255,255,255,0.15)] mx-auto mb-5" />

            {/* 分享卡片预览区 */}
            <div
              className="rounded-2xl p-5 mb-4 text-center"
              style={{ background: 'linear-gradient(135deg, #2a1020, #1a0a30)' }}
            >
              {/* 标语 */}
              <div className="mb-2 text-base font-bold tracking-wide" style={{ background: 'linear-gradient(135deg, #FF9ACB, #B380FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                今晚，我是王者 👑
              </div>
              <div className="text-4xl mb-2">💪</div>
              <div className="text-[10px] text-[rgba(245,240,242,0.4)] tracking-widest mb-1">亚洲猛男榜</div>
              <div
                className="text-4xl font-bold tabular-nums mb-1"
                style={{
                  background: 'linear-gradient(135deg, #FF9ACB, #B380FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                第 12,345 位
              </div>
              <div className="text-sm text-[rgba(245,240,242,0.6)] mb-3">击败全国 98% 的猛男</div>

              {/* 城市 + 好友排名 */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg p-2 bg-[rgba(255,154,203,0.08)] border border-[rgba(255,154,203,0.12)]">
                  <div className="text-[9px] text-[rgba(245,240,242,0.4)] mb-0.5">本城排名</div>
                  <div className="text-xs font-bold" style={{ background: 'linear-gradient(135deg, #FF9ACB, #B380FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>北京 第 888 名</div>
                  <div className="text-[9px] text-[rgba(245,240,242,0.35)]">城市前 2%</div>
                </div>
                <div className="rounded-lg p-2 bg-[rgba(179,128,255,0.08)] border border-[rgba(179,128,255,0.12)]">
                  <div className="text-[9px] text-[rgba(245,240,242,0.4)] mb-0.5">好友排名</div>
                  <div className="text-xs font-bold" style={{ background: 'linear-gradient(135deg, #B380FF, #FF9ACB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>超越 92%</div>
                  <div className="text-[9px] text-[rgba(245,240,242,0.35)]">的好友</div>
                </div>
              </div>

              {/* 战绩数据 */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                <div className="text-center">
                  <div className="text-base font-bold text-[#FF9ACB]">{TODAY_STATS.hardScore}</div>
                  <div className="text-[9px] text-[rgba(245,240,242,0.4)]">硬度评级</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-[#B380FF]">{TODAY_STATS.score}</div>
                  <div className="text-[9px] text-[rgba(245,240,242,0.4)]">综合评分</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-[rgba(245,240,242,0.85)]">{TODAY_STATS.duration}</div>
                  <div className="text-[9px] text-[rgba(245,240,242,0.4)]">本次时长</div>
                </div>
              </div>

              <div className="mt-3 text-[8px] text-[rgba(245,240,242,0.2)] tracking-wider">
                你的她 · {new Date().toLocaleDateString('zh-CN')}
              </div>
            </div>

            {/* 操作按钮 */}
            <button
              onClick={() => { alert('📸 已保存到相册！（演示模式）'); setShowShareModal(false) }}
              className="w-full py-3 rounded-2xl text-sm font-semibold mb-2 active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(90deg, #FF9ACB, #B380FF)', color: '#1a0a12' }}
            >
              💾 保存到相册
            </button>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 rounded-2xl text-[12px] text-[rgba(245,240,242,0.4)] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] active:scale-[0.98] transition-transform"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* spin 动画（AI 加载转圈，Tailwind 无内置 spin 关键帧时补充） */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

    </div>
  )
}
