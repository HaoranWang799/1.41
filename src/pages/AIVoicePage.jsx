import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import { useApp } from '../context/AppContext'
import { useL } from '../i18n/useL'
import { Mic } from 'lucide-react'

// TODO: 移到 src/data/voiceCharacters.js (Sub-step 4)
const VOICES = [
  { zh: '魅惑妖姬', en: 'Enchantress' },
  { zh: '清冷女仙', en: 'Ice Goddess' },
  { zh: '软萌病娇', en: 'Sweet Yandere' },
]

export default function AIVoicePage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const L = useL()
  const [selectedVoice, setSelectedVoice] = useState(0)

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      <HeaderBar title={L("专属灵魂调教", "Soul Customization")} onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-8 no-scrollbar">

        {/* 声线选择 */}
        <div className="flex space-x-4 overflow-x-auto no-scrollbar py-2">
          {VOICES.map((v, idx) => (
            <div
              key={idx}
              className={`min-w-[120px] bg-[#1E1324] border ${
                selectedVoice === idx ? 'border-[#FF7DAF]' : 'border-white/5'
              } p-4 rounded-2xl text-center space-y-3 shadow-md cursor-pointer active:scale-95 transition-transform`}
              onClick={() => {
                setSelectedVoice(idx)
                showToast(L(`已切换至 ${v.zh}`, `Switched to ${v.en}`))
              }}
            >
              <div
                className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                  selectedVoice === idx
                    ? 'bg-[#FF7DAF]/20 text-[#FF7DAF]'
                    : 'bg-white/5 text-[#9B859D]'
                }`}
              >
                <Mic size={20} />
              </div>
              <div className="text-sm font-bold">{L(v.zh, v.en)}</div>
            </div>
          ))}
        </div>

        {/* 性格调节 */}
        <div className="bg-[#1E1324] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
          <h4 className="text-xs font-bold text-[#FF7DAF] uppercase tracking-widest">
            {L('性格深度修正', 'Personality Tuning')}
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] text-[#9B859D]">
              <span>{L('温顺依恋', 'Submissive')}</span>
              <span>{L('强势主导', 'Dominant')}</span>
            </div>
            <input
              type="range"
              className="w-full h-1 bg-black/40 rounded-full appearance-none accent-[#FF7DAF]"
            />
          </div>
        </div>

        <button
          className="w-full bg-gradient-to-r from-[#FF7DAF] to-[#A87CFF] py-4 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
          onClick={() => showToast(L('人格注入成功', 'Personality locked'))}
        >
          {L('确认修改并锁定人格', 'Confirm & Lock Personality')}
        </button>
      </div>
    </div>
  )
}
