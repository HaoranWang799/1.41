import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/ui/Modal'
import { useApp } from '../context/AppContext'
import {
  Crown, Settings, Shield, Flame, Headphones, Smartphone,
  CreditCard, ShoppingBag, Sparkles, ChevronRight, LogOut,
  Moon, Battery, Wifi, Gift,
} from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const menuSections = [
    {
      title: '会员服务',
      items: [
        { icon: Crown,    label: '专属订阅管理', value: '高级版',  onClick: () => navigate('/recharge') },
        { icon: Settings, label: '个人偏好设置',                   onClick: () => navigate('/settings')     },
        { icon: Shield,   label: '隐私与安全锁',                   onClick: () => navigate('/privacy')      },
      ],
    },
    {
      title: '专属内容',
      items: [
        { icon: Flame,      label: '沉浸式剧情',   value: '3部',   onClick: () => navigate('/scripts')   },
        { icon: Headphones, label: '专属声线互动', value: '已激活', onClick: () => navigate('/ai-voice') },
      ],
    },
    {
      title: '感官互联',
      items: [
        { icon: Smartphone, label: '硬件连接与控制', onClick: () => navigate('/devices') },
      ],
    },
    {
      title: '账单',
      items: [
        { icon: CreditCard, label: '钱包与支付', onClick: () => navigate('/payment') },
      ],
    },
    {
      title: '探索',
      items: [
        { icon: ShoppingBag, label: '购买AI智能飞机杯', value: '全新发售', onClick: () => navigate('/hardware-store') },
        { icon: Sparkles,    label: '沉浸使用指南',                          onClick: () => navigate('/help')          },
      ],
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto pb-8 no-scrollbar relative z-10">

      {/* 头像 */}
      <div className="px-6 pt-12 pb-6 flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF2A6D] to-[#A87CFF] flex items-center justify-center text-xl font-bold text-white shadow-[0_0_25px_rgba(255,42,109,0.6)] border-2 border-[#FF2A6D]/30 shrink-0 relative animate-[breathe_3s_ease-in-out_infinite]">
          <div className="absolute inset-0 rounded-full bg-[#FF2A6D] blur-md opacity-20 animate-pulse" />
          AR
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#F9EDF5] tracking-wide">Alex Rivera</h1>
          <p className="text-sm flex items-center mt-0.5 text-[#FF2A6D]/90 animate-pulse font-medium">
            <Flame size={13} className="mr-1" />
            体温 38.5°C，心动升温中...
          </p>
        </div>
      </div>

      {/* 设备状态卡 */}
      <div className="px-4 mb-6">
        <div className="bg-[#1E1324]/80 backdrop-blur-md border border-[#FF2A6D]/30 rounded-2xl p-4 shadow-[0_8px_30px_rgba(255,42,109,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF2A6D]/5 to-transparent opacity-50" />
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#FF2A6D]/20 relative z-10">
            <div className="flex items-center space-x-3 text-sm">
              <div className="p-2 bg-[#FF2A6D]/20 rounded-xl text-[#FF2A6D] shadow-[0_0_15px_rgba(255,42,109,0.3)]">
                <Flame size={18} />
              </div>
              <div>
                <div className="text-[#F9EDF5] font-semibold">已连接: 专属互动设备</div>
                <div className="text-[11px] text-[#FF2A6D] mt-0.5 animate-pulse drop-shadow-[0_0_5px_#FF2A6D]">状态稳定在线 · 同步度 95%</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#9B859D]" />
          </div>
          <div className="flex justify-between text-center px-2 relative z-10">
            <div>
              <div className="text-lg font-bold text-[#FF2A6D] mb-1">87%</div>
              <div className="text-[11px] text-[#9B859D] flex items-center justify-center">
                <Battery size={11} className="mr-1" />设备活跃度
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#A87CFF] mb-1 drop-shadow-[0_0_8px_rgba(168,124,255,0.6)]">默契在线</div>
              <div className="text-[11px] text-[#9B859D] flex items-center justify-center">
                <Wifi size={11} className="mr-1" />连接同步率
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#F9EDF5] mb-1">刚刚</div>
              <div className="text-[11px] text-[#9B859D]">距上次互动</div>
            </div>
          </div>
        </div>
      </div>

      {/* 邀请 Banner */}
      <div className="px-4 mb-6" onClick={() => navigate('/referral')}>
        <div className="bg-gradient-to-r from-[#291515] to-[#1A0B0E] border border-[#FFB03A]/40 rounded-2xl p-4 flex items-center justify-between cursor-pointer active:scale-95 transition-transform shadow-[0_5px_25px_rgba(255,107,0,0.2)] relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-[#FFB03A]/10 to-transparent pointer-events-none" />
          <div className="flex items-center space-x-3 relative z-10 min-w-0">
            <div className="p-2.5 bg-gradient-to-br from-[#FFD700] to-[#FF6B00] rounded-xl text-white shadow-[0_0_15px_rgba(255,107,0,0.5)] shrink-0">
              <Gift size={20} className="fill-current" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#F9EDF5] mb-0.5 whitespace-nowrap">
                邀友共享 · 解锁<span className="text-[#FFD700]">专属礼遇</span>
              </div>
              <div className="text-[10px] text-[#9B859D]">
                送TA <span className="text-[#FFD700]">7天</span>，您获 <span className="text-[#FFD700]">$50</span> 邀请奖励
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#FFD700] to-[#FF6B00] text-[#1A0A00] text-xs px-3 py-1.5 rounded-full font-extrabold shrink-0 relative z-10 whitespace-nowrap">
            去分享
          </div>
        </div>
      </div>

      {/* 菜单 */}
      <div className="px-4 space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold text-[#FF7DAF]/70 tracking-wider mb-2 px-2">
              {section.title}
            </h3>
            <div className="bg-[#1E1324]/80 backdrop-blur-md border border-[#FF7DAF]/10 rounded-2xl overflow-hidden shadow-lg">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  onClick={item.onClick ?? (() => showToast('刺激功能即将上线'))}
                  className={`flex items-center justify-between p-4 cursor-pointer active:bg-[#FF7DAF]/10 transition-colors ${
                    i !== section.items.length - 1 ? 'border-b border-[#FF7DAF]/5' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 text-sm text-[#F9EDF5]">
                    <div className="text-[#FF7DAF]"><item.icon size={18} /></div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.value === '高级版' && (
                      <span className="bg-gradient-to-r from-[#FF7DAF] to-[#A87CFF] text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-[0_0_8px_rgba(255,125,175,0.5)]">
                        高级版
                      </span>
                    )}
                    {item.value === '全新发售' && (
                      <span className="bg-gradient-to-r from-[#FFD700] to-[#FF6B00] text-[10px] font-bold px-2 py-0.5 rounded-full text-[#1A0A00] animate-pulse">
                        {item.value}
                      </span>
                    )}
                    {item.value && item.value !== '高级版' && item.value !== '全新发售' && (
                      <span className="text-[#FF7DAF]/80 text-sm font-medium">{item.value}</span>
                    )}
                    <ChevronRight size={16} className="text-[#9B859D]/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 升级 Banner */}
      <div className="px-4 mt-8 mb-8">
        <div className="bg-[#141A27]/90 border border-[#6B7AA6]/30 rounded-2xl p-6 text-center relative overflow-hidden shadow-[0_10px_30px_rgba(25,35,58,0.35)]">
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#7B8EC8]/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#E37BA8]/15 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
          <Crown size={28} className="text-[#C7D3F0] mx-auto mb-3 relative z-10" />
          <h3 className="text-[#F3F6FF] text-lg font-bold mb-1 relative z-10">会员尊享服务</h3>
          <p className="text-xs text-[#B8C3E0] mb-2 relative z-10">解锁更细腻的互动反馈、专属剧情与优先响应</p>
          <p className="text-[11px] text-[#E2A4C4] mb-5 relative z-10">今晚，也可以和她更近一点</p>
          <button
            onClick={() => navigate('/recharge')}
            className="w-full bg-gradient-to-r from-[#4C5F91] to-[#8A6FAE] text-white text-sm font-bold py-3.5 rounded-full active:scale-95 transition-transform shadow-[0_4px_20px_rgba(85,105,160,0.45)] relative z-10"
          >
            去开通会员
          </button>
        </div>
      </div>

      {/* 退出 */}
      <div className="px-4 pb-8">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full py-4 text-[#FF4D6D] text-sm font-bold border border-[#FF4D6D]/30 bg-[#FF4D6D]/10 rounded-2xl flex items-center justify-center space-x-2 active:bg-[#FF4D6D]/20 transition-colors"
        >
          <LogOut size={16} />
          <span>断开连接，结束本次互动</span>
        </button>
        <div className="text-center mt-6 text-[#9B859D]/50 text-[10px] leading-relaxed">
          版本 2.5.0 · 私密守护<br />
          您的每一次心动与选择，都会被妥善保护。
        </div>
      </div>

      <Modal
        isOpen={showLogoutModal}
        title="离开当前空间？"
        content="退出后将暂停与专属伴侣的互动连接，确定现在离开吗？"
        confirmText="确认离开"
        cancelText="继续停留"
        isDanger={true}
        onConfirm={() => {
          setShowLogoutModal(false)
          showToast('已安全退出，欢迎下次再来')
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  )
}
