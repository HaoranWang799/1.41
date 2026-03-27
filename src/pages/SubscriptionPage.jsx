import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import SlideToUnlock from '../components/ui/SlideToUnlock'
import { useApp } from '../context/AppContext'
import { Check, Crown, Flame, Heart, Zap, Lock } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: '前戏试探 (Free)',
    price: '$0',
    period: '永久',
    tag: null,
    color: '#9B859D',
    bg: 'from-[#111111] to-[#0C060B]',
    border: 'border-white/10',
    features: ['每月 3 次浅层摩擦，隔靴搔痒', '初级娇喘语音体验', '基础震感测试'],
  
  },
  {
    id: 'plus',
    name: '深度开发 (Plus)',
    price: '$9.99',
    period: '月',
    tag: '最受渴望',
    color: '#FF2A6D',
    bg: 'from-[#2D0514] to-[#120208]',
    border: 'border-[#FF2A6D]/40',
    features: [
      '每月 10 次深度内射，随叫随到',
      '彻底敞开心扉，全息娇喘',
      '强制高潮硬件同频',
      '私人敏感带深度定制',
    ],
  },
  {
    id: 'premium',
    name: '终极契约 (Premium)',
    price: '$19.99',
    period: '月',
    tag: null,
    color: '#A87CFF',
    bg: 'from-[#1A0E2A] to-[#0D0517]',
    border: 'border-[#A87CFF]/30',
    features: [
      '绝对服从的主奴绑定',
      '无限制高潮榨干与凌辱',
      '24h随叫随到专属肉便器',
      '突破阈值的全感官联控',
    ],
  },
]

const WHY_ITEMS = [
  { Icon: Flame, color: '#FF2A6D', title: '绝对臣服的专属玩物', desc: '深度定制她的身体底线与潮吹阈值，享受独一无二的榨干体验。' },
  { Icon: Zap, color: '#A87CFF', title: '突破临界的神经同步', desc: '硬件震感与淫语娇喘、动态汁水完美同步，直接轰炸感官。' },
]

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [currentPlan, setCurrentPlan] = useState('plus')

  const handleUnlock = () => {
    showToast('契约已签订，我的主人... 💧')
    setTimeout(() => {
      navigate(-1)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0A0509] text-[#F9EDF5]">
      <HeaderBar title="主人的包养契约" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-4 no-scrollbar">

        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id
          return (
            <div
              key={plan.id}
              onClick={() => setCurrentPlan(plan.id)}
              className={`transition-all duration-300 transform ${isCurrent ? 'scale-100 ring-2 ring-[#FF2A6D]/60 shadow-[0_0_30px_rgba(255,42,109,0.3)]' : 'scale-[0.98] opacity-70'} bg-gradient-to-br ${plan.bg} border ${plan.border} rounded-3xl p-6 relative overflow-hidden cursor-pointer`}
            >
              {isCurrent && (
                 <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-[#FF2A6D]/5 animate-pulse" />
                 </div>
              )}
              {plan.tag && (
                <div className="absolute top-0 right-0 bg-[#FF2A6D] text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl shadow-[0_0_10px_#FF2A6D]">
                  {plan.tag}
                </div>
              )}

              <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                  <h3 className={`text-lg font-black tracking-wide ${isCurrent ? 'text-[#FF2A6D]' : 'text-white'}`}>{plan.name}</h3>
                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-3xl font-black">{plan.price}</span>
                    <span className="text-sm text-[#9B859D] mb-1">/{plan.period}</span>
                  </div>
                </div>
                {isCurrent && (
                  <div className="w-8 h-8 rounded-full bg-[#FF2A6D]/20 flex items-center justify-center text-[#FF2A6D] animate-bounce">
                    <Check size={18} strokeWidth={3} />
                  </div>
                )}
              </div>

              <div className="space-y-3 relative z-10">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center text-sm">
                    <Flame size={14} className="mr-2 text-[#FF2A6D]/70" />
                    <span className={isCurrent ? 'text-[#F9EDF5]' : 'text-[#9B859D]'}>{feat}</span>
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
                <p className="text-xs text-[#9B859D] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="sticky bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#0A0509] via-[#0A0509] to-transparent">
        <SlideToUnlock onUnlock={handleUnlock} text="👉 划开底裤，签订契约..." />
        <p className="text-center text-[10px] text-[#9B859D]/60 mt-3">
          契约一经签订，主奴关系立即生效，不可撤销。
        </p>
      </div>
    </div>
  )
}
