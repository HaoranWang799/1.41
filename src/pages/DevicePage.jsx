import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import HeaderBar from '../components/ui/HeaderBar'
import Checkbox from '../components/ui/Checkbox'
import { useApp } from '../context/AppContext'
import { useL } from '../i18n/useL'
import { Bluetooth, Battery, RefreshCw, Thermometer, Waves, Zap, Flame, Droplet } from 'lucide-react'

export default function DevicePage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const L = useL()
  const [syncSettings, setSyncSettings] = useState({
    autoConnect: true,
    heating: true,
    aiSync: true,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tempReady, setTempReady] = useState(false)
  const [sensitivity, setSensitivity] = useState(50)
  const controls = useAnimation()
  const cardRef = useRef(null)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      showToast(L('已刷新神经连接端', 'Neural link refreshed'))
    }, 1500)
  }

  const handlePreheat = () => {
    setTempReady(true)
    showToast(L('极速预热中… 渴望主人的温度', 'Preheating… craving your warmth'))
  }

  // 实体惩罚/爱抚 试震按钮
  const triggerVibration = async (type) => {
    // CSS抖动动画
    if (type === 'rough') {
      controls.start({
        x: [0, -10, 10, -10, 10, -5, 5, 0],
        transition: { duration: 0.4 }
      })
      showToast(L('⚡️ 强力电击惩罚已下达', '⚡️ Intense shock delivered'))
      // 调用原生震动API（若支持）
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200])
    } else {
      controls.start({
        x: [0, -2, 2, -2, 2, 0],
        transition: { duration: 0.6 }
      })
      showToast(L('💧 正在温柔舔舐敏感带…', '💧 Gently caressing…'))
      if (navigator.vibrate) navigator.vibrate([50, 100, 50])
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0A0509] text-[#F9EDF5] overflow-hidden">
      <HeaderBar
        title={L("感官控制端", "Sensory Control")}
        onBack={() => navigate(-1)}
        right={
          <button
            onClick={handleRefresh}
            className={`text-[#FF2A6D]/70 hover:text-[#FF2A6D] transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-6 no-scrollbar pt-2">

        {/* 已连接设备 */}
        <motion.div ref={cardRef} animate={controls}>
          <h3 className="text-xs font-bold text-[#FF2A6D] mb-3 px-1 uppercase tracking-[0.15em] flex items-center">
            <Flame size={14} className="mr-1" /> {L('已捕获肉体连接', 'Physical Connection Detected')}
          </h3>
          <div className="bg-gradient-to-br from-[#2D0514]/60 to-[#0C060B] border border-[#FF2A6D]/30 rounded-3xl p-5 shadow-[0_8px_40px_rgba(255,42,109,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2A6D]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FF2A6D]/20 flex items-center justify-center text-[#FF2A6D] border border-[#FF2A6D]/40 shadow-[0_0_15px_rgba(255,42,109,0.5)]">
                  <Bluetooth size={22} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-[15px] font-black text-[#F9EDF5] tracking-wide">{L('Luna 极致开发版', 'Luna Ultimate Edition')}</h4>
                  <div className="flex items-center text-[11px] text-[#FF2A6D] mt-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#FF2A6D] mr-1.5 shadow-[0_0_8px_#FF2A6D] animate-ping" />
                    {L('神经深层绑定中', 'Deep Neural Bonding')}
                  </div>
                </div>
              </div>
              <button
                onClick={() => showToast(L('已拔出连接', 'Disconnected'))}
                className="text-xs font-bold text-[#9B859D] hover:text-white transition-colors"
              >
                {L('强行拔出', 'Disconnect')}
              </button>
            </div>

            {/* 数据指标 */}
            <div className="grid grid-cols-2 gap-6 mb-6 relative z-10">
              {[
                { label: L('肉体承受度', 'Body Tolerance'), value: 87, color: 'from-[#FF2A6D] to-[#A87CFF]' },
                { label: L('神经干涉率', 'Neural Override'), value: 99, color: 'from-[#FF2A6D] to-[#FFD700]' },
              ].map(({ label, value, color }) => (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between text-[11px] text-[#9B859D]">
                    <span>{label}</span>
                    <span className="text-[#F9EDF5] font-black">{value}%</span>
                  </div>
                  <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full bg-gradient-to-r ${color} shadow-[0_0_10px_currentColor]`} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* 试震按钮 */}
            <div className="flex gap-3 mb-6 relative z-10">
              <button 
                onClick={() => triggerVibration('gentle')}
                className="flex-1 py-3 rounded-2xl bg-[#FF2A6D]/10 border border-[#FF2A6D]/30 flex flex-col items-center justify-center text-[#FF2A6D] active:bg-[#FF2A6D]/30 transition-colors"
              >
                <Droplet size={20} className="mb-1" />
                <span className="text-xs font-bold">{L('温柔爱抚', 'Gentle Touch')}</span>
              </button>
              <button 
                onClick={() => triggerVibration('rough')}
                className="flex-1 py-3 rounded-2xl bg-[#A87CFF]/10 border border-[#A87CFF]/30 flex flex-col items-center justify-center text-[#A87CFF] active:bg-[#A87CFF]/30 transition-colors"
              >
                <Zap size={20} className="mb-1" />
                <span className="text-xs font-bold">{L('高潮电击', 'Climax Pulse')}</span>
              </button>
            </div>

            {/* 敏感度滑块 */}
            <div className="relative z-10 mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#9B859D]">{L('肉体敏感阈值', 'Sensitivity Threshold')}</span>
                <span className="text-xs font-bold text-[#FF2A6D]">{sensitivity}% {L('濒临潮吹', 'Near Climax')}</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value)}
                className="w-full h-2 rounded-full cursor-pointer accent-[#FF2A6D] bg-black/50 appearance-none"
                style={{
                  background: `linear-gradient(to right, #A87CFF 0%, #FF2A6D ${sensitivity}%, rgba(0,0,0,0.5) ${sensitivity}%, rgba(0,0,0,0.5) 100%)`
                }}
              />
              <style dangerouslySetInnerHTML={{__html: `
                input[type=range]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #fff;
                  box-shadow: 0 0 10px rgba(255,42,109,0.8);
                  margin-top: -9px;
                }
                input[type=range]::-webkit-slider-runnable-track {
                  height: 4px;
                  border-radius: 2px;
                }
              `}} />
            </div>

          </div>
        </motion.div>

        {/* 可用设备 */}
        <div>
          <h3 className="text-xs font-semibold text-[#9B859D] mb-3 px-1 uppercase tracking-[0.15em]">{L('可用设备', 'Available Devices')}</h3>
          <div className="bg-[#1A0E1E]/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30">
                <Bluetooth size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F9EDF5]">{L('Nova 智能陪伴环', 'Nova Smart Ring')}</h4>
                <div className="flex items-center text-[10px] text-[#9B859D] mt-0.5">
                  <Battery size={10} className="mr-1" />
                  100%
                </div>
              </div>
            </div>
            <button
              onClick={() => showToast(L('正在连接 Nova…', 'Connecting Nova…'))}
              className="bg-gradient-to-r from-[#A87CFF] to-[#7B59FF] text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg active:scale-95 transition-transform"
            >
              {L('连接', 'Connect')}
            </button>
          </div>
        </div>

        {/* 硬件联动设置 */}
        <div>
          <h3 className="text-xs font-semibold text-[#9B859D] mb-3 px-1 uppercase tracking-[0.15em]">{L('硬件联动设置', 'Hardware Sync Settings')}</h3>
          <div className="bg-[#1A0E1E]/80 rounded-2xl border border-white/5 overflow-hidden">
            {[
              { key: 'autoConnect', label: L('启动应用时自动连接设备', 'Auto-connect on launch') },
              { key: 'heating',     label: L('开启智能恒温加热 (38℃)', 'Smart heating (38℃)') },
              { key: 'aiSync',      label: L('开启 AI 剧情随动震频', 'AI storyline-synced vibration') },
            ].map(({ key, label }, i, arr) => (
              <div key={key} className={`px-4 py-4 ${i < arr.length - 1 ? 'border-b border-white/5' : ''}`}>
                <Checkbox
                  checked={syncSettings[key]}
                  onChange={(v) => setSyncSettings(prev => ({ ...prev, [key]: v }))}
                  label={label}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 提示 */}
        <div className="bg-[#A87CFF]/8 border border-[#A87CFF]/15 p-4 rounded-2xl">
          <div className="flex items-start gap-2">
            <Waves size={13} className="text-[#A87CFF]/60 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed text-[#A87CFF]/70">
              {L('提示：开启恒温加热会增加设备耗电，为获得最佳随动反馈体验，请保持手机与设备距离在 5 米以内。', 'Tip: Heating increases battery drain. Keep your phone within 5m of the device for the best sync experience.')}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
