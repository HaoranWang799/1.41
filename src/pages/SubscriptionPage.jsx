import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import SlideToUnlock from '../components/ui/SlideToUnlock'
import { useApp } from '../context/AppContext'
import { Check, Crown, Flame, Heart, Zap, Lock } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: '轻享体验 (Free)',
    price: '$0',
    period: '永久',
    tag: null,
    color: '#8A94A6',
    bg: 'from-[#171A20] to-[#101319]',
    border: 'border-white/10',
    features: ['每月 3 次基础互动体验', '标准语音与情绪反馈', '基础硬件联动测试'],
  
  },
  {
    id: 'plus',
    name: '沉浸互动 (Plus)',
    price: '$9.99',
    period: '月',
    tag: '热门选择',
    color: '#E35D8E',
    bg: 'from-[#2A1A24] to-[#17131B]',
    border: 'border-[#E35D8E]/35',
    features: [
      '每月 10 次高阶互动体验',
      '更细腻的语音与情绪表达',
      '进阶硬件同步反馈',
      '个性化偏好定制',
    ],
  },
  {
    id: 'premium',
    name: '专属定制 (Premium)',
    price: '$19.99',
    period: '月',
    tag: null,
    color: '#7C88FF',
    bg: 'from-[#1A1E30] to-[#111423]',
    border: 'border-[#7C88FF]/30',
    features: [
      '高级专属角色与情景库',
      '无上限互动时长与次数',
      '24h 优先响应与专属通道',
      '全维度感官联动控制',
    ],
  },
]

const WHY_ITEMS = [
  { Icon: Flame, color: '#E35D8E', title: '更懂你的专属陪伴', desc: '根据你的偏好持续优化互动节奏与语气，体验更自然、更贴近。' },
  { Icon: Zap, color: '#7C88FF', title: '稳定顺滑的设备联动', desc: '语音、文本与硬件反馈低延迟协同，让每次互动都更完整。' },
]

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [currentPlan, setCurrentPlan] = useState('plus')

  const handleUnlock = () => {
    showToast('已开通专属计划，立即生效')
    setTimeout(() => {
      navigate(-1)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0E1117] text-[#F5F7FF]">
      <HeaderBar title="专属会员计划" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-4 no-scrollbar">

        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id
          return (
            <div
              key={plan.id}
              onClick={() => setCurrentPlan(plan.id)}
              className={`transition-all duration-300 transform ${isCurrent ? 'scale-100 ring-2 ring-white/35 shadow-[0_0_24px_rgba(120,132,180,0.25)]' : 'scale-[0.98] opacity-75'} bg-gradient-to-br ${plan.bg} border ${plan.border} rounded-3xl p-6 relative overflow-hidden cursor-pointer`}
            >
              {isCurrent && (
                 <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-white/5 animate-pulse" />
                 </div>
              )}
              {plan.tag && (
                <div className="absolute top-0 right-0 bg-[#E35D8E] text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl shadow-[0_0_10px_rgba(227,93,142,0.6)]">
                  {plan.tag}
                </div>
              )}

              <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                  <h3 className={`text-lg font-black tracking-wide ${isCurrent ? 'text-white' : 'text-[#D5DCEC]'}`}>{plan.name}</h3>
                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-3xl font-black">{plan.price}</span>
                    <span className="text-sm text-[#95A0B8] mb-1">/{plan.period}</span>
                  </div>
                </div>
                {isCurrent && (
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white animate-bounce">
                    <Check size={18} strokeWidth={3} />
                  </div>
                )}
              </div>

              <div className="space-y-3 relative z-10">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center text-sm">
                    <Flame size={14} className="mr-2 text-white/70" />
                    <span className={isCurrent ? 'text-[#F5F7FF]' : 'text-[#9AA4BA]'}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <div className="pt-6 pb-2">
          {WHY_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start space-x-4 mb-6">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                <item.Icon size={24} color={item.color} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-[#9AA4BA] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="sticky bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#0E1117] via-[#0E1117] to-transparent">
        <SlideToUnlock onUnlock={handleUnlock} text="👉 向右滑动，立即开通..." />
        <p className="text-center text-[10px] text-[#9AA4BA]/70 mt-3">
          开通后可在账户中随时管理套餐与续费设置。
        </p>
      </div>
    </div>
  )
}
