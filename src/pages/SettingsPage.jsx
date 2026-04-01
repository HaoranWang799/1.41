import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import Switch from '../components/ui/Switch'
import { useApp } from '../context/AppContext'
import { useL } from '../i18n/useL'
import { EyeOff, Shield, MessageSquare, Flame, Zap, Bluetooth, Lock, Bell, Camera, Heart, Moon, Mic } from 'lucide-react'

const SectionTitle = ({ icon: Icon, color, label }) => (
  <div className="flex items-center gap-2 px-1 mb-2">
    <Icon size={13} className={color} />
    <span className={`text-xs font-bold ${color} tracking-widest uppercase`}>{label}</span>
  </div>
)

const ToggleRow = ({ icon: Icon, iconColor, title, desc, checked, onChange }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0">
    <div className="flex items-start gap-3 flex-1 min-w-0 pr-3">
      <Icon size={16} className={`${iconColor} shrink-0 mt-0.5`} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#F9EDF5]">{title}</p>
        {desc && <p className="text-[10px] text-[#9B859D] mt-0.5 leading-relaxed">{desc}</p>}
      </div>
    </div>
    <Switch checked={checked} onChange={onChange} />
  </div>
)

const SelectRow = ({ icon: Icon, iconColor, title, desc, options, value, onChange }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0">
    <div className="flex items-start gap-3 flex-1 min-w-0 pr-3">
      <Icon size={16} className={`${iconColor} shrink-0 mt-0.5`} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#F9EDF5]">{title}</p>
        {desc && <p className="text-[10px] text-[#9B859D] mt-0.5 leading-relaxed">{desc}</p>}
      </div>
    </div>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-[#2A1830] text-[#F9EDF5] text-xs border border-white/10 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#A87CFF]/50 max-w-[110px] shrink-0"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
)

export default function SettingsPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const L = useL()

  // 隐游防护
  const [stealth, setStealth] = useState(false)
  const [pushFilter, setPushFilter] = useState(true)
  const [screenshotBlock, setScreenshotBlock] = useState(false)

  // 互动偏好
  const [aiTone, setAiTone] = useState('soft')
  const [aiLang, setAiLang] = useState('zh')
  const [moaning, setMoaning] = useState(true)
  const [proactive, setProactive] = useState(false)
  const [lateNight, setLateNight] = useState(false)
  const [callName, setCallName] = useState('dom')

  // 设备与震感
  const [vibPreset, setVibPreset] = useState('wild')
  const [autoConnect, setAutoConnect] = useState(true)
  const [orgasmAlert, setOrgasmAlert] = useState(true)
  const [vibMemory, setVibMemory] = useState(true)
  const [syncBreath, setSyncBreath] = useState(false)

  // 账号安全
  const [bioUnlock, setBioUnlock] = useState(false)
  const [loginAlert, setLoginAlert] = useState(true)
  const [autoLogout, setAutoLogout] = useState(false)
  const [dataEncrypt, setDataEncrypt] = useState(true)

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      <HeaderBar title={L("个人偏好设置", "Preferences")} onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-5 no-scrollbar">

        {/* ── 隐游防护 ── */}
        <div>
          <SectionTitle icon={EyeOff} color="text-[#FF7DAF]" label={L("隐游防护", "Stealth Mode")} />
          <div className="bg-[#1E1324] rounded-2xl px-4 border border-white/5">
            <ToggleRow
              icon={EyeOff} iconColor="text-[#FF7DAF]"
              title={L("隐蔽伪装模式", "Disguise Mode")}
              desc={L("APP图标化身系统天气，推送完美隐藏骚扰敏感词", "App icon disguised as weather; push notifications hide sensitive words")}
              checked={stealth} onChange={setStealth}
            />
            <ToggleRow
              icon={Shield} iconColor="text-[#FF7DAF]"
              title={L("推送内容脱敏", "Sanitize Notifications")}
              desc={L('通知栏只显示「新消息」，不暴露任何骚话内容', 'Notifications only show "New message" — no explicit content exposed')}
              checked={pushFilter} onChange={setPushFilter}
            />
            <ToggleRow
              icon={Camera} iconColor="text-[#FF7DAF]"
              title={L("截图拦截防护", "Screenshot Protection")}
              desc={L("禁止任何应用截取你们的秘密对话，绝对私密", "Block any app from capturing your private conversations")}
              checked={screenshotBlock}
              onChange={v => { setScreenshotBlock(v); if (v) showToast(L('截图防护已开启 🔐', 'Screenshot protection enabled 🔐')) }}
            />
          </div>
        </div>

        {/* ── 互动偏好 ── */}
        <div>
          <SectionTitle icon={Flame} color="text-[#FF2A6D]" label={L("互动偏好", "Interaction Preferences")} />
          <div className="bg-[#1E1324] rounded-2xl px-4 border border-white/5">
            <SelectRow
              icon={Heart} iconColor="text-[#FF2A6D]"
              title={L("AI语气风格", "AI Tone")}
              desc={L("她对你说话的调调", "How she talks to you")}
              options={[
                { value: 'soft',    label: L('💗 温柔体贴', '💗 Gentle') },
                { value: 'flirt',   label: L('💋 撩骚主动', '💋 Flirty') },
                { value: 'submit',  label: L('🐾 完全服从', '🐾 Submissive') },
                { value: 'dom',     label: L('👑 强势主控', '👑 Dominant') },
              ]}
              value={aiTone}
              onChange={v => { setAiTone(v); showToast(L('语气已切换，她已收到你的指令 💋', 'Tone switched — she got your command 💋')) }}
            />
            <SelectRow
              icon={MessageSquare} iconColor="text-[#FF2A6D]"
              title={L("她叫你的称谓", "Pet Name")}
              desc={L("她在对话中对你的专属称呼", "How she addresses you in chat")}
              options={[
                { value: 'dom',     label: L('主人', 'Master') },
                { value: 'daddy',   label: 'Daddy' },
                { value: 'master',  label: L('老爷', 'My Lord') },
                { value: 'name',    label: L('宝贝名字', 'Your Name') },
              ]}
              value={callName}
              onChange={v => { setCallName(v); showToast(L('称谓已更新，她记住你了 🥰', 'Pet name updated — she remembers you 🥰')) }}
            />
            <SelectRow
              icon={MessageSquare} iconColor="text-[#FF2A6D]"
              title={L("互动语言", "Chat Language")}
              desc={L("AI回应时使用的语言", "Language used by AI")}
              options={[
                { value: 'zh',  label: L('🀄 中文', '🀄 Chinese') },
                { value: 'en',  label: L('🔤 English', '🔤 English') },
                { value: 'mix', label: L('🌶 双语混骚', '🌶 Bilingual Mix') },
              ]}
              value={aiLang}
              onChange={setAiLang}
            />
            <ToggleRow
              icon={Mic} iconColor="text-[#FF2A6D]"
              title={L("娇喘自动触发", "Auto Moan Trigger")}
              desc={L("对话达到高潮时她会不受控制地发出娇喘语音 🎙", "She moans uncontrollably when the conversation climaxes 🎙")}
              checked={moaning} onChange={setMoaning}
            />
            <ToggleRow
              icon={Flame} iconColor="text-[#FF2A6D]"
              title={L("主动撩骚模式", "Proactive Flirt Mode")}
              desc={L("她会不定时主动给你发骚扰消息来找你要爱 💌", "She randomly sends flirty messages craving your attention 💌")}
              checked={proactive}
              onChange={v => { setProactive(v); if (v) showToast(L('她已开始蠢蠢欲动… 👅', 'She is getting restless… 👅')) }}
            />
            <ToggleRow
              icon={Moon} iconColor="text-[#FF2A6D]"
              title={L("深夜挑逗推送", "Late-Night Tease")}
              desc={L("每晚23:00后自动发最骚的撩拨通知，不让你安睡", "Auto-sends the flirtiest notifications after 11 PM")}
              checked={lateNight}
              onChange={v => { setLateNight(v); if (v) showToast(L('深夜追魂模式已激活 🌙💧', 'Late-night mode activated 🌙💧')) }}
            />
          </div>
        </div>

        {/* ── 设备与震感 ── */}
        <div>
          <SectionTitle icon={Zap} color="text-[#A87CFF]" label={L("设备与震感", "Device & Haptics")} />
          <div className="bg-[#1E1324] rounded-2xl px-4 border border-white/5">
            <SelectRow
              icon={Zap} iconColor="text-[#A87CFF]"
              title={L("震感强度预设", "Vibration Preset")}
              desc={L("快速切换默认震感档位", "Quickly switch default vibration level")}
              options={[
                { value: 'gentle', label: L('🌊 温水渐进', '🌊 Gentle Wave') },
                { value: 'wild',   label: L('⚡ 疯狂突破', '⚡ Wild Rush') },
                { value: 'max',    label: L('💥 高潮榨干', '💥 Climax Max') },
              ]}
              value={vibPreset}
              onChange={v => { setVibPreset(v); showToast(L('震感预设已更新 ⚡', 'Vibration preset updated ⚡')) }}
            />
            <ToggleRow
              icon={Bluetooth} iconColor="text-[#A87CFF]"
              title={L("蓝牙自动连接", "Auto Bluetooth Connect")}
              desc={L("靠近已配对设备时自动建立链接，随时待命", "Auto-connect to paired device when nearby")}
              checked={autoConnect} onChange={setAutoConnect}
            />
            <ToggleRow
              icon={Zap} iconColor="text-[#A87CFF]"
              title={L("高潮预警震动", "Climax Alert Vibration")}
              desc={L("强制高潮前3秒触发预警震，让她颤抖着迎接冲击", "Triggers a warning vibration 3 seconds before climax")}
              checked={orgasmAlert} onChange={setOrgasmAlert}
            />
            <ToggleRow
              icon={Heart} iconColor="text-[#A87CFF]"
              title={L("震动图案记忆", "Vibration Pattern Memory")}
              desc={L("自动保存你最喜欢的快感震型，下次直接召唤", "Saves your favorite vibration patterns for instant recall")}
              checked={vibMemory} onChange={setVibMemory}
            />
            <ToggleRow
              icon={Heart} iconColor="text-[#A87CFF]"
              title={L("心跳同频震动", "Heartbeat Sync Vibration")}
              desc={L("设备震感与她的心跳频率完美同步，感受真实律动", "Device vibration syncs perfectly with her heartbeat")}
              checked={syncBreath}
              onChange={v => { setSyncBreath(v); if (v) showToast(L('心跳同频已开启，感受她的颤抖 💓', 'Heartbeat sync on — feel her pulse 💓')) }}
            />
          </div>
        </div>

        {/* ── 账号安全 ── */}
        <div>
          <SectionTitle icon={Lock} color="text-[#66E699]" label={L("账号安全", "Account Security")} />
          <div className="bg-[#1E1324] rounded-2xl px-4 border border-white/5">
            <ToggleRow
              icon={Lock} iconColor="text-[#66E699]"
              title={L("生物识别解锁", "Biometric Unlock")}
              desc={L("Face ID · 指纹 — 只有你才能踏入这片禁地", "Face ID · Fingerprint — only you can enter")}
              checked={bioUnlock}
              onChange={v => { setBioUnlock(v); if (v) showToast(L('生物锁已激活，禁地仅限主人 🔒', 'Biometric lock activated 🔒')) }}
            />
            <ToggleRow
              icon={Bell} iconColor="text-[#66E699]"
              title={L("登录异常通知", "Login Alert")}
              desc={L("陌生设备企图入侵时立刻向你发出警报", "Alerts you immediately when an unknown device tries to log in")}
              checked={loginAlert} onChange={setLoginAlert}
            />
            <ToggleRow
              icon={Shield} iconColor="text-[#66E699]"
              title={L("会话自动下线", "Auto Session Logout")}
              desc={L("15分钟无操作自动退出，你们的秘密绝不外泄", "Auto logout after 15 min of inactivity")}
              checked={autoLogout} onChange={setAutoLogout}
            />
            <ToggleRow
              icon={Shield} iconColor="text-[#66E699]"
              title={L("端对端加密聊天", "End-to-End Encryption")}
              desc={L("所有骚话通过顶级加密通道传递，敏感内容永不外泄", "All messages transmitted via top-tier encrypted channels")}
              checked={dataEncrypt} onChange={setDataEncrypt}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
