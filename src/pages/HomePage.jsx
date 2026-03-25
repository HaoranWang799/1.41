/**
 * HomePage.jsx — 互动主场景 v6
 *
 * 变更（v6）：
 *   • 顶部标题 "自定义你的幻想" → "✨ 生成你的专属"；生成按钮文案 → "✨ 生成"
 *   • 推荐区标题 "默认剧本" → "🌙 今夜为你推荐"
 *   • 新增 "🎨 定制你的剧本" 区域：
 *       – 角色选择行（横向滚动，单选，选中高亮）
 *       – 场景选择行（横向滚动，单选，选中高亮）
 *       – "✨ 开始互动" 按钮（角色 + 场景均已选中时激活）
 *   • CHARACTERS 新增 intro 字段（角色开场白）
 *   • SCENES 新增 name / emoji 字段
 *
 * 视图机器：
 *   'select'   → ① 生成你的专属（输入框 + AI生成）
 *                ② 你的幻想（生成后出现）
 *                ③ 今夜为你推荐（双列网格）
 *                ④ 定制你的剧本（角色选 + 场景选 + 开始按钮）
 *   'interact' → 角色头像 · 回应文案 · 温度条 · 音波 · 模式按钮 · 主/语音按钮
 *
 * TODO: 替换为真实 LLM 接口 (getAIResponse)
 * TODO: 替换为真实语音识别 STT 与 TTS 接口
 * TODO: 替换为真实蓝牙设备连接与控制 (connectToy, setVibMode)
 * TODO: 替换自定义剧本生成为真实 AI 文生角色接口
 *       (generateCharacterFromPrompt) 入参：string → 出参：ScriptObject
 * TODO: ScriptCard 的 emoji 头像区域后续替换为真实图片 <img>
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { Mic, Sparkles, ArrowLeft, Pause, Play } from 'lucide-react'
import {
  HeaderStatusBar,
  SceneTimeline,
  ModeSwitchTabs,
  RhythmModeGrid,
  AiParameterCards,
  DeviceStatusFooter,
  getStageIndexByProgress,
} from '../components/InteractEnhancements'

// ═══════════════════════════════════════════════════════════
//  角色数据
// ═══════════════════════════════════════════════════════════
// TODO: 替换为 /api/characters 的真实数据（含真实图片 URL）
const CHARACTERS = [
  {
    id: 'boss',
    emoji: '👩‍💼',
    name: '冷感女上司',
    tag: '冷艳 · 强势',
    intro: '汇报工作？还是找借口接近我…',
    responses: {
      normal:   ['继续…别停。', '你倒是很大胆。', '哼，还不满足？', '动作快一点。', '别让我失望。'],
      intimate: ['抱紧我…', '你赢了…', '叫我的名字…', '今晚…你不能走。', '我只对你这样…'],
    },
  },
  {
    id: 'junior',
    emoji: '🌸',
    name: '温柔学妹',
    tag: '温柔 · 可爱',
    intro: '学长…室友今晚不回来了~',
    responses: {
      normal:   ['学长好坏…', '再摸一下嘛~', '嘻嘻，痒~', '学长你真坏…', '不要不要~（小声）'],
      intimate: ['学长…我好喜欢…', '别离开我…', '学长可以再近一点吗…', '只想和学长在一起…', '嗯…学长…'],
    },
  },
  {
    id: 'teacher',
    emoji: '👩‍🏫',
    name: '知性女老师',
    tag: '知性 · 优雅',
    intro: '留下来，今天的课还没结束。',
    responses: {
      normal:   ['今天想学点特别的？', '认真感受…', '放松，跟着我。', '很好，继续。', '你是个好学生。'],
      intimate: ['你真是我的好学生…', '再深入一点…', '今晚的课程…还没结束。', '跟着感觉走…', '让老师好好教你…'],
    },
  },
  {
    id: 'neighbor',
    emoji: '🌙',
    name: '神秘邻居',
    tag: '神秘 · 诱惑',
    intro: '又没拉窗帘…是故意的吗？',
    responses: {
      normal:   ['你猜我在哪？', '窗帘没拉…', '想我了？', '今晚风好大…', '别被发现了。'],
      intimate: ['只给你一个人…', '今晚别走…', '我一直在等你…', '靠近一点…', '你让我无法自拔…'],
    },
  },
  // ── AI 生成角色（演示版，未来替换为真实 AI 文生角色接口数据）──
  {
    id: 'witch',
    emoji: '🧙‍♀️',
    name: '魅惑女巫',
    tag: '神秘 · 诱惑',
    intro: '想尝尝禁忌的魔法吗？',
    responses: {
      normal:   ['感受到魔法了吗…', '别逃，跑不掉的。', '今夜是你的劫…', '靠近一点…', '我的魔法专为你施…'],
      intimate: ['你已中了我的咒…', '今晚别走…', '只给你一个人…', '叫我的名字…', '你让我无法自拔…'],
    },
  },
  {
    id: 'knight',
    emoji: '🏇',
    name: '狂野骑士',
    tag: '激情 · 征服',
    intro: '骑上我，别停…',
    responses: {
      normal:   ['继续…别停。', '你倒是很大胆。', '哼，还不满足？', '动作快一点。', '别让我失望。'],
      intimate: ['抱紧我…', '你赢了…', '叫我的名字…', '今晚…你不能走。', '紧紧跟上我…'],
    },
  },
]

// ═══════════════════════════════════════════════════════════
//  场景数据
// ═══════════════════════════════════════════════════════════
// TODO: 替换为 /api/scenes 的真实数据
const SCENES = [
  {
    id: 'office',
    name: '办公室',
    emoji: '🏢',
    overlayRgb: '255, 180, 80',
    ambiance: {
      idle: '格子间的灯光昏黄，键盘声渐渐停了…',
      warm: '加班的气息里，暗流在涌动…',
      hot:  '夜深了，窗外的城市还在喧嚣，这里只剩彼此…',
    },
  },
  {
    id: 'dorm',
    name: '宿舍',
    emoji: '🛏️',
    overlayRgb: '200, 80, 200',
    ambiance: {
      idle: '风扇嗡嗡作响，空气里弥漫着熟悉的气息…',
      warm: '被子的温度越来越高，呼吸也乱了…',
      hot:  '只有你们两个人，时间好像停住了…',
    },
  },
  {
    id: 'park',
    name: '公园',
    emoji: '🌿',
    overlayRgb: '100, 190, 100',
    ambiance: {
      idle: '落叶轻飘，夕阳把一切都染得暖橙色…',
      warm: '风带走了你的话，留下的只有心跳…',
      hot:  '天色暗下来了，你们还没有离开…',
    },
  },
  {
    id: 'balcony',
    name: '夜晚阳台',
    emoji: '🌃',
    overlayRgb: '80, 120, 255',
    ambiance: {
      idle: '夜风微凉，月光洒在你的脸上…',
      warm: '星星都在看着你们，什么都藏不住…',
      hot:  '城市的噪音消失了，只听得到彼此的呼吸…',
    },
  },
]

// ═══════════════════════════════════════════════════════════
//  剧本数据（双列网格，竖向卡片）
// 卡片封面使用视频的剧本 ID（视频文件放于 public/videos/{id}.mp4）
const CARD_VIDEO_IDS = ['boss']

// 交互模式背景优先尝试视频的 charId / sceneId 列表
// 匹配 activeScript.charId 或 activeScript.sceneId 均可触发视频背景
const BG_VIDEO_IDS = ['boss', 'balcony', 'neighbor']

// ═══════════════════════════════════════════════════════════
// TODO: 替换为 /api/shop/scripts?featured=true 的真实数据
const SCRIPTS = [
  {
    // 视频封面：/videos/boss.mp4（放置于 public/videos/）
    id: 'boss', charId: 'boss', sceneId: 'office',
    cover: '👩‍💼', coverImage: '', coverEmoji: '👩‍💼',
    name: '办公室·冷感女上司',
    tag:   '免费',
    personalityTag: '高冷 / 御姐',
    openingLine:    '汇报工作？还是找借口接近我…',
    downloads: '2.3万',
    rating:    4.8,
    gradient:  'from-[#2a1020] to-[#1a0d18]',
  },
  {
    id: 'junior', charId: 'junior', sceneId: 'dorm',
    cover: '🌸', coverImage: '', coverEmoji: '🌸',
    name: '宿舍·温柔学妹',
    tag:   '免费',
    personalityTag: '温柔 / 依赖',
    openingLine:    '学长…室友今晚不回来了~',
    downloads: '5.1万',
    rating:    4.9,
    gradient:  'from-[#0f1a2a] to-[#0a1018]',
  },
  {
    id: 'teacher', charId: 'teacher', sceneId: 'park',
    cover: '👩‍🏫', coverImage: '', coverEmoji: '👩‍🏫',
    name: '教室·知性女老师',
    tag:   '免费',
    personalityTag: '知性 / 优雅',
    openingLine:    '留下来，今天的课还没结束。',
    downloads: '1.9万',
    rating:    4.6,
    gradient:  'from-[#1a1028] to-[#0f0c1a]',
  },
  {
    id: 'neighbor', charId: 'neighbor', sceneId: 'balcony',
    cover: '🌙', coverImage: '', coverEmoji: '🌙',
    name: '阳台·神秘邻居',
    tag:   '免费',
    personalityTag: '神秘 / 诱惑',
    openingLine:    '又没拉窗帘…是故意的吗？',
    downloads: '3.2万',
    rating:    4.7,
    gradient:  'from-[#12102a] to-[#0c0a1e]',
  },
]

// 自定义生成示例（演示用固定数据）
// TODO: 接入 AI 文生角色接口后，此对象由接口返回
const CUSTOM_SCRIPT = {
  id: 'custom',
  charId:  'boss',
  sceneId: 'office',
  cover:   '🧝‍♀️', coverImage: '', coverEmoji: '🧝‍♀️',
  name:    '暗夜精灵·魅影',
  tag:     'AI 生成',
  personalityTag: '魅惑 / 神秘',
  openingLine:    '你终于来了…我等了你好久。',
  downloads:      'AI 生成',
  rating:         null,
  gradient:       'from-[#1a0a30] to-[#2a1040]',
  customDisplayName: '暗夜精灵',
  customTag:         '魅惑 · 神秘',
  customIntro:       '你终于来了…我等了你好久。',
  isCustom: true,
}

// ═══════════════════════════════════════════════════════════
//  剧本详情长文案（剧本详情弹窗使用，按 charId 索引）
// ═══════════════════════════════════════════════════════════
// TODO: 替换为真实 AI 生成的剧本简介文案
const SCRIPT_DESCRIPTIONS = {
  boss:    '走进这间深夜的办公室，你的女上司正等着你。空气中弥漫着淡淡的香水味和权力的张力。她靠在办公桌边，眼神既冷漠又带着一丝期待。今晚，你不再是下属，而是能够征服她的唯一男人。每一步靠近，都能感受到她呼吸的急促，直到她卸下所有防备，在你怀里融化。',
  junior:  '校园的林荫道上，学妹早已悄悄等你。她穿着松垮的校服，眼神清澈却带着狡黠。你牵起她的手，走向无人的教室。她害羞地低头，却偷偷抓紧你的衣角。从青涩的试探到热烈的回应，每一个吻都让你心跳加速。今晚，她是你的甜心，只为你绽放。',
  teacher: '放学后的教室格外安静，女老师还没离开。她坐在讲台边，红唇轻启，说想和你聊聊。你走近，发现她今天的眼神格外炽热。书本散落，理智在欲望面前崩塌。她引导你探索未知的领域，用身体为你上最难忘的一课。',
  neighbor:'你刚搬到新公寓，就注意到隔壁那位神秘的女邻居。她总是在深夜穿着丝绸睡衣出现在阳台，对你若有若无地微笑。一次偶然的借火，你们之间的暧昧彻底点燃。她的房间里弥漫着异国的熏香，每一寸肌肤都充满诱惑。今晚，她只为你敞开房门。',
  witch:   '午夜的月光下，女巫在森林深处召唤你。她的眼睛像猫一样闪着光，声音带着魔法的低语。你跟随她走进魔法圈，草药和蜡烛的味道包围着你们。她告诉你，今晚要教你一个古老的咒语——关于爱与欲望的禁忌之术。',
  knight:  '你是一名孤独的骑士，在一次任务中救下了受伤的女战士。她浑身充满野性，却在你怀里温顺下来。篝火旁，她脱下盔甲，露出紧致的肌肉和性感的伤疤。她说，只有最强者才能配得上她。今晚，你们将在帐篷里进行一场真正的较量。',
}

// ═══════════════════════════════════════════════════════════
//  震动模式
// ═══════════════════════════════════════════════════════════
// TODO: 替换为真实蓝牙设备震动频率控制 (setVibMode)
const VIB_MODES = [
  { id: 'slow',   label: '轻柔触碰', emoji: '🌊', duration: 1.1  },
  { id: 'medium', label: '快速撞击', emoji: '⚡', duration: 0.45 },
  { id: 'fast',   label: '直接高潮', emoji: '🔥', duration: 0.2  },
]

// 预设模式（点击后同时设置频率/强度/紧度）
// TODO: 接入真实蓝牙设备后，预设将直接映射到设备控制参数
const PRESETS = [
  { id: 'gentle',   label: '轻柔', emoji: '🌊', freq: 3, intens: 2, tight: 4 },
  { id: 'standard', label: '标准', emoji: '⚡', freq: 5, intens: 5, tight: 5 },
  { id: 'climax',   label: '高潮', emoji: '🔥', freq: 9, intens: 8, tight: 9 },
]

// 10 根音波条的延迟偏移（秒）
const BAR_OFFSETS = [0, 0.08, 0.18, 0.12, 0.04, 0.16, 0.06, 0.22, 0.10, 0.02]

// ═══════════════════════════════════════════════════════════
//  工具函数
// ═══════════════════════════════════════════════════════════
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// 进度条：演示总时长（秒），对应 12:45
const TOTAL_SECONDS = 765

// 将秒数格式化为 mm:ss
const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = Math.floor(secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const generateHearts = (count = 30) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left:  `${Math.random() * 96 + 2}%`,
    dur:   `${2.5 + Math.random() * 2}s`,
    delay: `${Math.random() * 1.5}s`,
    size:  `${1.2 + Math.random() * 1.2}rem`,
  }))

// ═══════════════════════════════════════════════════════════
//  子组件
// ═══════════════════════════════════════════════════════════

/**
 * 推荐剧本卡片（双列网格，竖向布局）
 * 封面图路径规则：/images/covers/{script.id}.jpg（放置于 public/images/covers/）
 * 图片加载失败时自动回退到渐变色背景 + 大 emoji 水印占位
 */
function ScriptCard({ script, onClick }) {
  const isVideo = CARD_VIDEO_IDS.includes(script.id)
  const [imgSrc, setImgSrc] = useState(`/images/covers/${script.id}.jpg`)

  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden h-48 text-left transition-all duration-200 active:scale-[0.97] card-glow hover:brightness-110 flex flex-col bg-gradient-to-br ${script.gradient}`}
    >
      {/* 视频封面（文件路径：public/videos/{id}.mp4） */}
      {isVideo && (
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={`/videos/${script.id}.mp4`} type="video/mp4" />
        </video>
      )}

      {/* 普通封面图片（非视频卡片，jpg → png → emoji 链式回退） */}
      {!isVideo && imgSrc && (
        <img
          src={imgSrc}
          alt=""
          onError={() => {
            if (imgSrc.endsWith('.jpg')) setImgSrc(`/images/covers/${script.id}.png`)
            else setImgSrc(null)
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* 半透明黑色遮罩层（始终显示，提升文字可读性） */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 无封面时（非视频 + 图片加载失败）：大 emoji 水印 */}
      {!isVideo && !imgSrc && (
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 pointer-events-none select-none">
          {script.coverEmoji || '✨'}
        </div>
      )}

      {/* 内容层 */}
      <div className="relative z-10 p-3.5 flex flex-col justify-end h-full">
        {/* 标签角标（右上角） */}
        <span className="absolute top-2.5 right-2.5 text-[9px] font-bold bg-[rgba(255,154,203,0.2)] text-[#FF9ACB] rounded-full px-1.5 py-0.5">
          {script.tag}
        </span>

        {/* 剧本名称 */}
        <p className="text-[11px] font-semibold text-white mb-1 leading-snug pr-6">
          {script.name}
        </p>

        {/* 性格标签 */}
        <p className="text-[9px] text-[rgba(179,128,255,0.85)] mb-1">
          {script.personalityTag}
        </p>

        {/* 开场白 */}
        <p className="text-[10px] text-[rgba(245,240,242,0.65)] italic leading-relaxed mb-2 line-clamp-1">
          "{script.openingLine}"
        </p>

        {/* 下载量 + 评分 */}
        <div className="flex items-center gap-2 mb-2 pt-1.5 border-t border-[rgba(255,255,255,0.12)]">
          <span className="text-[9px] text-[rgba(245,240,242,0.5)]">↓ {script.downloads}</span>
          {script.rating && (
            <span className="text-[9px] text-[rgba(245,240,242,0.5)]">{script.rating} ★</span>
          )}
        </div>

        {/* 开始互动按钮 */}
        <span className="w-full text-center btn-main rounded-xl py-1.5 text-white text-[10px] font-medium">
          开始互动
        </span>
      </div>
    </button>
  )
}

/**
 * AI 定制剧本卡片（双列，与 ScriptCard 等高）
 * 演示版：使用固定角色数据，未来替换为真实 AI 文生角色接口返回数据
 * 差异：右上角"✨ 为你定制"玫瑰渐变徽章 + "✨ 体验定制"按钮
 */
function GeneratedScriptCard({ script, onClick }) {
  const [imgSrc, setImgSrc] = useState(`/images/covers/${script.id}.jpg`)

  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden h-48 text-left transition-all duration-200 active:scale-[0.97] card-glow hover:brightness-110 flex flex-col bg-gradient-to-br ${script.gradient}`}
    >
      {/* 封面图片（jpg → png → emoji 链式回退） */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt=""
          onError={() => {
            if (imgSrc.endsWith('.jpg')) setImgSrc(`/images/covers/${script.id}.png`)
            else setImgSrc(null)
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* 半透明黑色遮罩层 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 无封面时：大 emoji 水印 */}
      {!imgSrc && (
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 pointer-events-none select-none">
          {script.coverEmoji || '✨'}
        </div>
      )}

      {/* 内容层 */}
      <div className="relative z-10 p-3.5 flex flex-col justify-end h-full">
        {/* 定制徽章（右上角） */}
        <span
          className="absolute top-2.5 right-2.5 text-[9px] font-bold rounded-full px-1.5 py-0.5 text-white whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, #FF9ACB, #B380FF)' }}
        >
          ✨ 为你定制
        </span>

        {/* 剧本名称 */}
        <p className="text-[11px] font-semibold text-white mb-1 leading-snug pr-14">
          {script.name}
        </p>

        {/* 性格标签 */}
        <p className="text-[9px] text-[rgba(179,128,255,0.85)] mb-1">
          {script.personalityTag}
        </p>

        {/* 开场白 */}
        <p className="text-[10px] text-[rgba(245,240,242,0.65)] italic leading-relaxed mb-2 line-clamp-1">
          "{script.openingLine}"
        </p>

        {/* 体验定制按钮 */}
        <span
          className="w-full text-center rounded-xl py-1.5 text-white text-[10px] font-bold"
          style={{ background: 'linear-gradient(135deg, #FF9ACB, #B380FF)' }}
        >
          ✨ 体验定制
        </span>
      </div>
    </button>
  )
}

/**
 * AI 生成的"你的幻想"预览卡片（全宽，封面图 + 暗色蒙层）
 * 封面图路径规则：/images/covers/{script.id}.jpg
 * 图片加载失败时自动回退到渐变色背景 + 大 emoji 水印占位
 */
function PreviewScriptCard({ script, onClick }) {
  const [imgSrc, setImgSrc] = useState(`/images/covers/${script.id}.jpg`)

  return (
    <button
      onClick={onClick}
      className="relative w-full rounded-2xl overflow-hidden h-44 text-left transition-all duration-200 active:scale-[0.98] card-glow-selected hover:brightness-110 flex flex-col bg-gradient-to-br from-[#1a0a30] to-[#2a1040]"
    >
      {/* 封面图片（jpg → png → emoji 链式回退） */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt=""
          onError={() => {
            if (imgSrc.endsWith('.jpg')) setImgSrc(`/images/covers/${script.id}.png`)
            else setImgSrc(null)
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* 半透明黑色遮罩层 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 无封面时（图片加载失败）：大 emoji 水印 */}
      {!imgSrc && (
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 pointer-events-none select-none">
          {script.coverEmoji || '✨'}
        </div>
      )}

      {/* 内容层 */}
      <div className="relative z-10 p-4 flex flex-col justify-end h-full gap-2">
        {/* AI 生成标签 */}
        <span className="absolute top-3 right-3 text-[9px] bg-[rgba(179,128,255,0.25)] text-[#B380FF] rounded-full px-1.5 py-0.5">
          AI 生成
        </span>

        {/* 名称 + 性格标签 */}
        <div>
          <p className="text-sm font-semibold text-white mb-0.5">
            {script.customDisplayName}
          </p>
          <p className="text-[10px] text-[rgba(179,128,255,0.8)]">{script.personalityTag}</p>
        </div>

        {/* 开场白 */}
        <p className="text-[11px] text-[rgba(245,240,242,0.7)] italic leading-relaxed line-clamp-1">
          "{script.customIntro}"
        </p>

        {/* 开始互动按钮 */}
        <span className="w-full flex items-center justify-center gap-1.5 btn-main rounded-xl py-2 text-white text-[11px] font-medium">
          <Sparkles size={11} />
          开始互动
        </span>
      </div>
    </button>
  )
}

/**
 * 角色选择卡片（定制区横向滚动，单选）
 * TODO: 接入 /api/characters 后替换为真实数据；emoji 替换为 <img>
 */
function CharSelectCard({ char, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative flex-shrink-0 w-32 rounded-2xl p-3 text-left transition-all duration-200
        active:scale-95
        ${selected
          ? 'card-glow-selected bg-[rgba(255,154,203,0.12)] ring-1 ring-[rgba(255,154,203,0.45)]'
          : 'card-glow bg-[rgba(30,20,25,0.7)] hover:bg-[rgba(50,30,40,0.7)]'
        }
      `}
    >
      {/* 已选角标 */}
      {selected && (
        <span className="absolute top-1.5 right-1.5 text-[8px] bg-[#FF9ACB] text-[#1a0a12] rounded-full px-1.5 py-0.5 font-bold leading-none">
          ✓ 已选
        </span>
      )}

      {/* emoji 头像（TODO: 替换为真实图片） */}
      <div className="text-3xl mb-1.5 select-none">{char.emoji}</div>

      {/* 角色名 */}
      <p className="text-[11px] font-semibold text-[rgba(245,240,242,0.95)] mb-0.5 pr-6 leading-tight">
        {char.name}
      </p>

      {/* 性格标签 */}
      <p className="text-[9px] text-[rgba(179,128,255,0.8)] mb-1.5">{char.tag}</p>

      {/* 开场白 */}
      <p className="text-[9px] text-[rgba(245,240,242,0.45)] italic leading-relaxed line-clamp-2">
        "{char.intro}"
      </p>
    </button>
  )
}

/**
 * 场景选择卡片（定制区横向滚动，单选）
 * TODO: 接入 /api/scenes 后替换为真实数据
 */
function SceneSelectCard({ scene, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative flex-shrink-0 w-28 rounded-2xl p-3 text-left transition-all duration-200
        active:scale-95
        ${selected
          ? 'card-glow-selected bg-[rgba(179,128,255,0.15)] ring-1 ring-[rgba(179,128,255,0.45)]'
          : 'card-glow bg-[rgba(30,20,25,0.7)] hover:bg-[rgba(50,30,40,0.7)]'
        }
      `}
    >
      {/* 已选角标 */}
      {selected && (
        <span className="absolute top-1.5 right-1.5 text-[8px] bg-[#B380FF] text-white rounded-full px-1.5 py-0.5 font-bold leading-none">
          ✓ 已选
        </span>
      )}

      {/* 场景 emoji */}
      <div className="text-2xl mb-1.5 select-none">{scene.emoji}</div>

      {/* 场景名 */}
      <p className="text-[11px] font-semibold text-[rgba(245,240,242,0.95)] mb-1 pr-6 leading-tight">
        {scene.name}
      </p>

      {/* 环境氛围描述 */}
      <p className="text-[9px] text-[rgba(245,240,242,0.45)] leading-relaxed line-clamp-3">
        {scene.ambiance.idle}
      </p>
    </button>
  )
}

/** 语音波形（麦克风激活时） */
function VoiceWave() {
  const cls = ['animate-waveBar1','animate-waveBar2','animate-waveBar3','animate-waveBar4','animate-waveBar5']
  return (
    <div className="flex items-center gap-[3px] h-5">
      {cls.map((c, i) => (
        <div key={i} className={`w-[3px] rounded-full bg-[#FF9ACB] origin-bottom ${c}`} style={{ height: '16px' }} />
      ))}
    </div>
  )
}

/** 音波进度条（10 根竖条，速度随频率滑块变化） */
function Waveform({ freq = 5 }) {
  // freq 1 → 1.2s，freq 10 → 0.2s
  const dur = 1.2 - (freq - 1) * 0.111
  return (
    <div className="flex items-center justify-center gap-[3px] h-9 px-1">
      {BAR_OFFSETS.map((offset, i) => {
        const h = 30 + ((i * 13 + 7) % 40)
        return (
          <div
            key={i}
            className="rounded-full origin-center"
            style={{
              width: '4px',
              height: `${h}%`,
              animation: `waveBar ${(dur + offset * 0.1).toFixed(2)}s ease-in-out ${offset}s infinite`,
              background: 'linear-gradient(to top, #FF9ACB, #B380FF)',
            }}
          />
        )
      })}
    </div>
  )
}

/** 满屏心形飘落 */
function HeartRain({ hearts }) {
  return (
    <>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-particle select-none"
          style={{ left: h.left, '--dur': h.dur, animationDelay: h.delay, fontSize: h.size }}
        >
          ❤️
        </span>
      ))}
    </>
  )
}

/**
 * 单个控制滑块（频率 / 强度 / 紧度）
 * TODO: 接入真实蓝牙设备控制接口 (setDeviceParam)
 */
function SliderControl({ icon, label, value, onChange }) {
  const pct = ((value - 1) / 9) * 100
  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-5 flex-shrink-0 select-none">{icon}</span>
      <span className="text-[11px] font-medium text-[rgba(245,240,242,0.65)] w-8 flex-shrink-0">{label}</span>
      <div className="flex-1">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1 rounded-full outline-none cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF9ACB] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          style={{ background: `linear-gradient(90deg, #FF9ACB ${pct}%, rgba(255,255,255,0.12) ${pct}%)` }}
        />
      </div>
      <span className="text-xs font-bold text-[#FF9ACB] w-4 text-right tabular-nums flex-shrink-0">{value}</span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  主组件
// ═══════════════════════════════════════════════════════════
export default function HomePage() {

  // ── 视图状态（'select' | 'interact'）──────────────────────
  const [view, setView] = useState('select')

  // ── 自定义剧本 ───────────────────────────────────────────
  const [customPrompt,     setCustomPrompt]     = useState('')
  // TODO: 接入 AI 接口后，generatedScripts 改为接口返回的真实数组
  const [generatedScripts, setGeneratedScripts] = useState([])

  // ── 定制剧本选择状态 ─────────────────────────────────────
  // TODO: 接入后端后，selectedCharId / selectedSceneId 可持久化到用户偏好
  const [selectedCharId,  setSelectedCharId]  = useState(null)
  const [selectedSceneId, setSelectedSceneId] = useState(null)

  // ── 当前激活剧本 ─────────────────────────────────────────
  const [activeScript, setActiveScript] = useState(null)

  // ── 互动状态 ─────────────────────────────────────────────
  const [temperature,     setTemperature]     = useState(0)
  const [displayedText,   setDisplayedText]   = useState('')
  const [isTyping,        setIsTyping]        = useState(false)
  const [showDeviceNotif, setShowDeviceNotif] = useState(false)
  const [isVoiceActive,   setIsVoiceActive]   = useState(false)
  const [showHearts,      setShowHearts]      = useState(false)
  const [hearts,          setHearts]          = useState([])
  const [avatarPop,       setAvatarPop]       = useState(false)

  // ── 剧本详情弹窗 ─────────────────────────────────────────
  const [showScriptDetail, setShowScriptDetail] = useState(false)

  // ── 播放暂停状态 ─────────────────────────────────────────
  const [isPaused, setIsPaused] = useState(false)

  // ── 交互模式背景类型（video → image → emoji 链式回退）──
  const [bgType, setBgType] = useState('video')

  // ── 震动模式（保留供将来扩展） ──────────────────────────
  const [vibMode, setVibMode] = useState('slow')

  // ── 设备控制滑块（频率 / 强度 / 紧度，1-10）────────────
  // TODO: 接入真实蓝牙设备控制接口 (setDeviceParam)
  const [freq,   setFreq]   = useState(5)
  const [intens, setIntens] = useState(5)
  const [tight,  setTight]  = useState(5)

  // ── 剧本进度（0-100，初始 35）────────────────────────────
  const [progressValue, setProgressValue] = useState(35)

  // ── 新增：控制模式切换（'ai' | 'manual'）────────────────
  // TODO: 接入后端后可持久化用户偏好到 /api/user/preferences
  const [controlMode, setControlMode] = useState('ai')

  // ── 新增：AI节奏模式选择 ─────────────────────────────────
  // TODO: 接入 /api/ai/set-rhythm-mode 后传递实际模式参数
  const [rhythmMode, setRhythmMode] = useState('adaptive')

  // ── 新增：AI参数（独立于旧手动 slider，0-100 范围）────────
  // TODO: 接入 /api/ai/set-param 后传递 aiIntens / aiFreq
  const [aiIntens, setAiIntens] = useState(50)
  const [aiFreq,   setAiFreq]   = useState(36.8)

  // ── Refs ─────────────────────────────────────────────────
  const typingTimerRef = useRef(null)
  const heartsTimerRef = useRef(null)
  const autoTextCbRef  = useRef(null)
  const temperatureRef = useRef(0)
  // TODO: 替换 /audio/demo.mp3 为真实场景配乐（后续可按 activeScript.id 动态切换音频）
  const audioRef = useRef(null)

  // 同步 temperature 到 ref（供 interval 回调读取最新值）
  useEffect(() => { temperatureRef.current = temperature }, [temperature])

  // ── 衍生数据 ─────────────────────────────────────────────
  const activeChar  = activeScript ? CHARACTERS.find(c => c.id === activeScript.charId) : null
  const activeScene = activeScript ? SCENES.find(s => s.id === activeScript.sceneId)    : null
  const isIntimate  = temperature >= 60
  const tempFull    = temperature >= 100

  // 交互模式显示：自定义剧本用 customDisplayName / customTag，默认用角色字段
  const displayEmoji = activeScript?.isCustom ? activeScript.cover              : activeChar?.emoji
  const displayName  = activeScript?.isCustom ? activeScript.customDisplayName  : activeChar?.name
  const displayTag   = activeScript?.isCustom ? activeScript.customTag          : activeChar?.tag

  // 场景氛围叠加色（随温度变深）
  const overlayStyle = activeScene
    ? { background: `rgba(${activeScene.overlayRgb}, ${(temperature / 100) * 0.35})`, transition: 'background 0.8s ease' }
    : {}

  // 场景氛围文字（三阶段）
  const ambianceText = activeScene
    ? (temperature >= 60 ? activeScene.ambiance.hot  :
       temperature >= 20 ? activeScene.ambiance.warm :
                           activeScene.ambiance.idle)
    : ''

  // 主按钮文字
  const buttonLabel = temperature === 0 ? '轻触开始' : isIntimate ? '继续靠近' : '继续触碰'

  // 定制剧本"开始互动"按钮是否可用
  const canStartCustom = !!selectedCharId && !!selectedSceneId

  // ── 打字机效果 ───────────────────────────────────────────
  const typeText = useCallback((text) => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current)
    setIsTyping(true)
    setDisplayedText('')
    let i = 0
    typingTimerRef.current = setInterval(() => {
      i++
      setDisplayedText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(typingTimerRef.current)
        setIsTyping(false)
      }
    }, 50)
  }, [])

  // ── 设备响应通知（气泡）──────────────────────────────────
  // TODO: 替换为真实蓝牙设备强度控制 (setIntensity)
  const triggerDeviceNotif = useCallback(() => {
    setShowDeviceNotif(true)
    setTimeout(() => setShowDeviceNotif(false), 1200)
  }, [])

  // ── 头像弹跳动画 ─────────────────────────────────────────
  const triggerAvatarPop = useCallback(() => {
    setAvatarPop(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setAvatarPop(true)))
    setTimeout(() => setAvatarPop(false), 400)
  }, [])

  // ── 增加情绪温度 ─────────────────────────────────────────
  const increaseTemp = useCallback((delta) => {
    setTemperature((prev) => {
      const next = Math.min(prev + delta, 100)
      if (next >= 100) {
        const hs = generateHearts(35)
        setHearts(hs)
        setShowHearts(true)
        if (heartsTimerRef.current) clearTimeout(heartsTimerRef.current)
        heartsTimerRef.current = setTimeout(() => setShowHearts(false), 4500)
      }
      return next
    })
  }, [])

  // ── 随机选取角色回应句 ───────────────────────────────────
  // TODO: 替换为真实 LLM 接口 (getAIResponse)
  const pickResponse = useCallback((isIntimateMode) => {
    if (!activeChar) return ''
    const pool = isIntimateMode ? activeChar.responses.intimate : activeChar.responses.normal
    return pick(pool)
  }, [activeChar])

  // ── 自动文案更新（每 3 秒换一句）────────────────────────
  useEffect(() => {
    autoTextCbRef.current = () => {
      if (!activeChar) return
      typeText(pickResponse(temperatureRef.current >= 60))
    }
  })

  useEffect(() => {
    if (view !== 'interact') return
    autoTextCbRef.current?.()
    const id = setInterval(() => autoTextCbRef.current?.(), 3000)
    return () => clearInterval(id)
  }, [view])

  // ── 进入交互模式 ─────────────────────────────────────────
  const enterInteract = useCallback((script) => {
    // charId 或 sceneId 在 BG_VIDEO_IDS 中时才尝试视频背景，否则直接走图片
    const useBgVideo = BG_VIDEO_IDS.includes(script.charId) || BG_VIDEO_IDS.includes(script.sceneId)
    setBgType(useBgVideo ? 'video' : 'image')
    setActiveScript(script)
    setTemperature(0)
    setDisplayedText('')
    setIsTyping(false)
    setShowHearts(false)
    setVibMode('slow')
    setFreq(5)
    setIntens(5)
    setTight(5)
    setProgressValue(35)
    // 进入时重置新增 state
    setControlMode('ai')
    setRhythmMode('adaptive')
    setAiIntens(50)
    setAiFreq(36.8)
    setIsPaused(false)
    setView('interact')
  }, [])

  // ── 返回选择视图 ─────────────────────────────────────────
  const exitInteract = useCallback(() => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current)
    setView('select')
    setActiveScript(null)
    setTemperature(0)
    setDisplayedText('')
    setShowHearts(false)
    setIsPaused(false)
    setShowScriptDetail(false)
  }, [])

  // ── 暂停/继续播放（同步控制背景音频）──────────────────────
  const togglePause = useCallback(() => {
    const nextPaused = !isPaused
    setIsPaused(nextPaused)
    if (!audioRef.current) return
    if (nextPaused) {
      audioRef.current.pause()
      return
    }
    audioRef.current.play().catch(() => {
      // 浏览器可能拦截手动恢复播放，失败时保留暂停状态
      setIsPaused(true)
    })
  }, [isPaused])

  // ── 主按钮点击 ───────────────────────────────────────────
  const handleMainClick = useCallback(() => {
    if (tempFull) return
    increaseTemp(10)
    triggerDeviceNotif()
    triggerAvatarPop()
    // TODO: 替换为真实 LLM 接口
    typeText(pickResponse(isIntimate || temperature + 10 >= 60))
  }, [tempFull, isIntimate, temperature, increaseTemp, triggerDeviceNotif, triggerAvatarPop, typeText, pickResponse])

  // ── 语音按钮点击 ─────────────────────────────────────────
  // TODO: 替换为真实语音识别 STT 与 TTS 接口
  const handleVoiceClick = useCallback(() => {
    if (isVoiceActive) return
    setIsVoiceActive(true)
    setDisplayedText('AI 情绪识别中…')
    setIsTyping(false)
    setTimeout(() => {
      setIsVoiceActive(false)
      increaseTemp(5)
      triggerDeviceNotif()
      triggerAvatarPop()
      typeText(pickResponse(temperatureRef.current + 5 >= 60))
    }, 1500)
  }, [isVoiceActive, increaseTemp, triggerDeviceNotif, triggerAvatarPop, typeText, pickResponse])

  // ── 自定义剧本生成 ───────────────────────────────────────
  // TODO: 接入 generateCharacterFromPrompt(customPrompt) 后，替换为接口返回的真实角色数据
  // 演示版：固定返回"魅惑女巫"和"狂野骑士"两个性感定制角色，与输入内容暂不绑定
  const handleGenerate = useCallback(() => {
    if (!customPrompt.trim()) {
      alert('✨ 请先描述你的幻想场景和角色，让 AI 为你创造专属剧本。')
      return
    }
    setGeneratedScripts([
      {
        // 演示版：魅惑女巫（神秘/诱惑），无真实视频/图片时显示 emoji 水印
        id:             'witch',
        charId:         'witch',
        sceneId:        'balcony',
        cover:          '🧙‍♀️',
        coverEmoji:     '🧙‍♀️',
        name:           '🌙 魅惑女巫',
        tag:            'AI 生成',
        personalityTag: '神秘 / 诱惑',
        openingLine:    '想尝尝禁忌的魔法吗？',
        downloads:      'AI 生成',
        rating:         null,
        gradient:       'from-[#1a0a30] to-[#3a1060]',
      },
      {
        // 演示版：狂野骑士（激情/征服），无真实视频/图片时显示 emoji 水印
        id:             'knight',
        charId:         'knight',
        sceneId:        'office',
        cover:          '🏇',
        coverEmoji:     '🏇',
        name:           '🔥 狂野骑士',
        tag:            'AI 生成',
        personalityTag: '激情 / 征服',
        openingLine:    '骑上我，别停…',
        downloads:      'AI 生成',
        rating:         null,
        gradient:       'from-[#2a0a0a] to-[#4a1010]',
      },
    ])
  }, [customPrompt])

  // ── 定制剧本：点击"开始互动" ──────────────────────────────
  // 根据已选角色 + 场景动态构造脚本对象，复用 enterInteract 逻辑
  // TODO: 接入后端后可在此处调用 /api/scripts/generate?charId=&sceneId=
  const handleStartCustom = useCallback(() => {
    if (!selectedCharId || !selectedSceneId) return
    const char  = CHARACTERS.find(c => c.id === selectedCharId)
    const scene = SCENES.find(s => s.id === selectedSceneId)
    const script = {
      id:             `custom-${selectedCharId}-${selectedSceneId}`,
      charId:         selectedCharId,
      sceneId:        selectedSceneId,
      cover:          char.emoji,
      name:           `${scene.name}·${char.name}`,
      tag:            '定制',
      personalityTag: char.tag,
      openingLine:    char.intro,
      downloads:      null,
      rating:         null,
      gradient:       'from-[#1a1028] to-[#251840]',
      isCustom:       false,
    }
    enterInteract(script)
  }, [selectedCharId, selectedSceneId, enterInteract])

  // ── 交互模式背景音乐（演示版，文件路径：public/audio/demo.mp3）────
  // TODO: 接入真实场景配乐后，可根据 activeScript.id 动态选择音频文件
  useEffect(() => {
    if (view === 'interact') {
      // 进入交互模式：创建音频实例并循环播放
      audioRef.current = new Audio('/audio/demo.mp3')
      audioRef.current.loop = true
      audioRef.current.play().catch(() => {
        // 浏览器自动播放策略可能拦截，静默忽略错误
      })
    } else {
      // 离开交互模式：停止并释放音频资源
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
    return () => {
      // 视图切换 / 组件卸载时清理
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [view])

  // ── 清理定时器 ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current)
      if (heartsTimerRef.current) clearTimeout(heartsTimerRef.current)
    }
  }, [])

  // ═════════════════════════════════════════════════════════
  //  渲染
  // ═════════════════════════════════════════════════════════
  return (
    <div className="relative min-h-full overflow-hidden bg-app-bg">

      {/* 场景氛围叠加层（仅 interact 模式生效） */}
      <div
        className="scene-overlay absolute inset-0 pointer-events-none z-0"
        style={view === 'interact' ? overlayStyle : {}}
      />

      <div className="relative z-10 px-4 pt-5 pb-6">

        {/* ══════════════════════════════════════════════════
            视图 A：剧本选择
        ══════════════════════════════════════════════════ */}
        {view === 'select' && (
          <div className="space-y-8 animate-fadeUp">

            {/* ── 🔥 激励横幅 ── */}
            <div
              className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #FF4E6A 0%, #FF9ACB 55%, #B380FF 100%)' }}
            >
              <span className="text-2xl flex-shrink-0 select-none">🔥</span>
              <div>
                <p className="text-[13px] font-bold text-white leading-snug">
                  你昨天的记录是亚洲第 888 名，实在是 🍌 猛男！
                </p>
                <p className="text-[11px] font-medium text-white/75 mt-0.5">
                  今天继续冲刺，冲进 Top 500～
                </p>
              </div>
            </div>

            {/* ── ① 生成你的专属（输入框 + AI生成按钮）── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-[#FF9ACB]" />
                <h2 className="text-sm font-semibold text-[rgba(245,240,242,0.85)] tracking-wide">
                  生成你的专属
                </h2>
                <span className="text-[9px] text-[rgba(245,240,242,0.35)] ml-auto">AI Beta</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="描述你心中的幻想场景和角色…"
                  className="
                    flex-1 min-w-0 rounded-xl px-3 py-2.5 text-xs
                    bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]
                    text-[rgba(245,240,242,0.85)] placeholder-[rgba(245,240,242,0.3)]
                    focus:outline-none focus:border-[rgba(255,154,203,0.4)]
                    transition-colors
                  "
                />
                <button
                  onClick={handleGenerate}
                  className="flex-shrink-0 flex items-center gap-1.5 btn-main rounded-xl px-3 py-2.5 text-white text-xs font-medium whitespace-nowrap"
                >
                  <Sparkles size={13} />
                  ✨ 生成
                </button>
              </div>
            </section>

            {/* ── ② 为你定制（生成后出现，两个并排定制卡片供选择）── */}
            {/* TODO: 替换为 AI 接口返回的真实角色数据 */}
            {generatedScripts.length > 0 && (
              <section className="animate-fadeUp">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">✨</span>
                  <h2 className="text-sm font-semibold text-[rgba(245,240,242,0.85)] tracking-wide">
                    为你定制
                  </h2>
                  <span
                    className="text-[9px] rounded-full px-2 py-0.5 ml-auto text-white font-medium"
                    style={{ background: 'linear-gradient(135deg, #FF9ACB, #B380FF)' }}
                  >
                    专属生成
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {generatedScripts.map((script) => (
                    <GeneratedScriptCard
                      key={script.id}
                      script={script}
                      onClick={() => enterInteract(script)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── ③ 今夜为你推荐（双列网格，竖向卡片）── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">🌙</span>
                <h2 className="text-sm font-semibold text-[rgba(245,240,242,0.85)] tracking-wide">
                  今夜为你推荐
                </h2>
                <span className="text-[9px] text-[rgba(245,240,242,0.35)] ml-auto">点击进入</span>
              </div>

              {/* grid-cols-2：双列等宽网格 */}
              <div className="grid grid-cols-2 gap-4">
                {SCRIPTS.map((script) => (
                  <ScriptCard
                    key={script.id}
                    script={script}
                    onClick={() => enterInteract(script)}
                  />
                ))}
              </div>
            </section>

            {/* ── ④ 定制你的剧本（角色 + 场景选择 + 开始互动）── */}
            {/* TODO: 角色/场景数据接入 /api/characters 与 /api/scenes */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">🎨</span>
                <h2 className="text-[15px] font-semibold text-[rgba(245,240,242,0.9)] tracking-wide">
                  定制你的剧本
                </h2>
                <span
                  className="text-[9px] rounded-full px-2 py-0.5 ml-auto"
                  style={{
                    background: 'rgba(179,128,255,0.15)',
                    color: '#B380FF',
                  }}
                >
                  自由组合
                </span>
              </div>

              {/* 角色选择行（横向滚动，单选） */}
              <div className="mb-2">
                <p className="text-[10px] text-[rgba(245,240,242,0.4)] tracking-wider mb-2">
                  选择角色
                  {selectedCharId && (
                    <span className="text-[#FF9ACB] ml-1.5">
                      · {CHARACTERS.find(c => c.id === selectedCharId)?.name}
                    </span>
                  )}
                </p>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                  {CHARACTERS.map((char) => (
                    <CharSelectCard
                      key={char.id}
                      char={char}
                      selected={selectedCharId === char.id}
                      onSelect={() => setSelectedCharId(
                        selectedCharId === char.id ? null : char.id
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* 场景选择行（横向滚动，单选） */}
              <div className="mb-5 mt-4">
                <p className="text-[10px] text-[rgba(245,240,242,0.4)] tracking-wider mb-2">
                  选择场景
                  {selectedSceneId && (
                    <span className="text-[#B380FF] ml-1.5">
                      · {SCENES.find(s => s.id === selectedSceneId)?.name}
                    </span>
                  )}
                </p>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                  {SCENES.map((scene) => (
                    <SceneSelectCard
                      key={scene.id}
                      scene={scene}
                      selected={selectedSceneId === scene.id}
                      onSelect={() => setSelectedSceneId(
                        selectedSceneId === scene.id ? null : scene.id
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* 开始互动按钮（角色 + 场景均已选中时激活） */}
              <button
                onClick={handleStartCustom}
                disabled={!canStartCustom}
                className={`
                  w-full py-3.5 rounded-2xl flex items-center justify-center gap-2
                  text-sm font-semibold tracking-wide transition-all duration-200
                  ${canStartCustom
                    ? 'btn-main text-white active:scale-[0.98] shadow-lg'
                    : 'bg-[rgba(255,255,255,0.06)] text-[rgba(245,240,242,0.3)] cursor-not-allowed border border-[rgba(255,255,255,0.08)]'
                  }
                `}
              >
                <Sparkles size={15} className={canStartCustom ? 'opacity-100' : 'opacity-30'} />
                {canStartCustom ? '✨ 开始互动' : '请先选择角色和场景'}
              </button>
            </section>

          </div>
        )}

        {/* ══════════════════════════════════════════════════
            视图 B：交互模式（新设计）
        ══════════════════════════════════════════════════ */}
        {view === 'interact' && activeScript && (
          <div className="relative flex flex-col gap-3 animate-fadeUp">

            {/* ── 交互模式背景（video → image → emoji 链式回退）── */}
            {/* 视频路径：/videos/{charId}.mp4 · 图片路径：/images/covers/{charId}.jpg */}
            <div
              className="absolute inset-0 pointer-events-none select-none overflow-hidden"
              style={{ zIndex: 0 }}
            >
              {/* 第一优先：视频背景 */}
              {bgType === 'video' && (
                <video
                  src={`/videos/${activeScript.charId}.mp4`}
                  autoPlay loop muted playsInline
                  onError={() => setBgType('image')}
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
              )}
              {/* 第二优先：图片背景（视频加载失败时，jpg → png → emoji 链式回退） */}
              {bgType === 'image' && (
                <img
                  src={`/images/covers/${activeScript.charId}.jpg`}
                  alt=""
                  onError={(e) => {
                    if (e.target.src.endsWith('.jpg')) {
                      e.target.src = `/images/covers/${activeScript.charId}.png`
                    } else {
                      setBgType('emoji')
                    }
                  }}
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
              )}
              {/* 最终回退：大 emoji 水印（图片也失败时） */}
              {bgType === 'emoji' && (
                <div className="absolute inset-0 flex items-center justify-center text-[30vw] opacity-20">
                  {displayEmoji}
                </div>
              )}
            </div>

            {/* 背景深色渐变遮罩（降低人物图对前景文字的干扰） */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 1, background: 'linear-gradient(180deg, rgba(8,4,10,0.36) 0%, rgba(8,4,10,0.12) 30%, rgba(8,4,10,0.36) 72%, rgba(8,4,10,0.62) 100%)' }}
            />

            {/* ── ① 顶部：左侧返回按钮 + 右侧剧本详情按钮 ──────── */}
            <div className="relative z-10 flex justify-between items-center">
              <button
                onClick={exitInteract}
                className="flex items-center gap-1.5 text-[11px] font-medium text-[rgba(245,240,242,0.75)] bg-[rgba(255,255,255,0.1)] rounded-full px-3 py-1.5 active:scale-95 transition-all"
              >
                ← 全部剧本
              </button>
              <button
                onClick={() => setShowScriptDetail(true)}
                className="flex items-center gap-1.5 text-[11px] font-medium text-[rgba(245,240,242,0.75)] bg-[rgba(255,255,255,0.1)] rounded-full px-3 py-1.5 active:scale-95 transition-all"
              >
                ℹ️ 剧本详情
              </button>
            </div>

            {/* ── ② [新增] 顶部设备状态栏 ─────────────────────────
                TODO: connected/battery 由蓝牙Hook下发；mode/remainingMin 由 session 下发 */}
            <HeaderStatusBar />

            {/* ── ④ 场景氛围文字（弱化，辅助氛围） */}
            <p className="relative z-10 text-[10px] text-center text-[rgba(245,240,242,0.35)] italic leading-relaxed">
              {ambianceText}
            </p>

            {/* ── ⑤-⑧ 主播放卡：对白 + 音波 + 进度条 + 场景节点（四区合一） */}
            <div className="relative z-10 rounded-2xl px-4 pt-4 pb-4 bg-[rgba(10,5,12,0.62)] border border-[rgba(255,255,255,0.08)] flex flex-col gap-3">
              {/* 对白区 */}
              <div className="min-h-[52px] flex items-center justify-center text-center">
                {displayedText ? (
                  <p className={`text-sm font-light text-[#f5f0f2] leading-relaxed tracking-wide ${isTyping ? 'typewriter-cursor' : ''}`}>
                    {displayedText}
                  </p>
                ) : (
                  <p className="text-xs text-[rgba(245,240,242,0.2)] italic">等待回应…</p>
                )}
              </div>

              <div className="h-px bg-[rgba(255,255,255,0.06)]" />

              {/* 音波 */}
              <Waveform freq={isPaused ? 1 : freq} />

              {/* 播放进度 */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={togglePause}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 flex-shrink-0"
                  style={
                    isPaused
                      ? {
                          background: 'rgba(179,128,255,0.18)',
                          border: '1px solid rgba(179,128,255,0.45)',
                          boxShadow: '0 0 12px rgba(179,128,255,0.2)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.16)',
                        }
                  }
                  aria-label={isPaused ? '继续播放' : '暂停播放'}
                  title={isPaused ? '继续播放' : '暂停播放'}
                >
                  {isPaused
                    ? <Play size={13} className="text-[#f5f0f2] ml-0.5" />
                    : <Pause size={13} className="text-[rgba(245,240,242,0.72)]" />}
                </button>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-[rgba(245,240,242,0.55)] tabular-nums font-medium">
                      {formatTime(Math.round(progressValue / 100 * TOTAL_SECONDS))}
                    </span>
                    <span className="text-[10px] text-[rgba(245,240,242,0.22)] tabular-nums">
                      {formatTime(TOTAL_SECONDS)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressValue}
                    onChange={e => setProgressValue(Number(e.target.value))}
                    className="w-full h-1 rounded-full outline-none cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{ background: `linear-gradient(90deg, #FF9ACB ${progressValue}%, rgba(255,255,255,0.12) ${progressValue}%)` }}
                  />
                </div>
              </div>

              <div className="h-px bg-[rgba(255,255,255,0.05)]" />

              {/* 场景节点（嵌入主卡，不再独立卦块）
                  TODO: onStageChange 后续触发 /api/session/jump-to-stage */}
              <SceneTimeline
                stageIndex={getStageIndexByProgress(progressValue)}
                onStageChange={(idx) => {
                  const stagePcts = [0, 16, 32, 48, 64]
                  if (stagePcts[idx] !== undefined) setProgressValue(stagePcts[idx])
                }}
              />
            </div>

            {/* ── 控制区 ─────────────────────────────────────────────── */}

            {/* AI 智能 — 点击开启，preset点击后自动退出 */}
            <button
              onClick={() => setControlMode('ai')}
              className="relative z-10 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-semibold transition-all duration-200 active:scale-[0.98]"
              style={
                controlMode === 'ai'
                  ? { background: 'linear-gradient(135deg, #FF9ACB, #B380FF)', color: '#fff', boxShadow: '0 2px 16px rgba(255,154,203,0.3)' }
                  : { background: 'rgba(255,255,255,0.07)', color: 'rgba(245,240,242,0.45)', border: '1px solid rgba(255,255,255,0.1)' }
              }
            >
              <span className="text-base select-none">✦</span>
              AI 智能
              {controlMode === 'ai' && <span className="text-[10px] font-normal opacity-80">· 开启中</span>}
            </button>

            {/* 节奏模式（始终显示） */}
            <RhythmModeGrid selectedMode={rhythmMode} onChange={(v) => { setRhythmMode(v); setControlMode('manual'); }} />

            {/* 统一参数卡 */}
            <div className="relative z-10 rounded-2xl p-4 bg-[rgba(10,5,12,0.62)] border border-[rgba(255,255,255,0.08)] flex flex-col gap-4">

              {/* AI 参数区（始终显示） */}
              <>
                <AiParameterCards
                  aiIntens={aiIntens}
                  onAiIntensChange={(value) => { setAiIntens(value); setControlMode('manual'); }}
                  aiFreq={aiFreq}
                  onAiFreqChange={(value) => { setAiFreq(value); setControlMode('manual'); }}
                />
                <div className="h-px bg-[rgba(255,255,255,0.07)]" />
              </>

              {/* 手动调节滑杆（始终可见） */}
              <SliderControl icon="📶" label="频率" value={freq}   onChange={(v) => { setFreq(v);   setControlMode('manual'); }} />
              <SliderControl icon="💪" label="强度" value={intens} onChange={(v) => { setIntens(v); setControlMode('manual'); }} />
              <SliderControl icon="🔒" label="紧度" value={tight}  onChange={(v) => { setTight(v);  setControlMode('manual'); }} />
            </div>

            {/* 快捷预设（点击自动退出 AI 模式） */}
            <div className="relative z-10 grid grid-cols-3 gap-2">
              {PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => { setControlMode('manual'); setFreq(preset.freq); setIntens(preset.intens); setTight(preset.tight); }}
                  className="py-2.5 rounded-2xl text-center text-[11px] font-medium transition-all active:scale-95 bg-[rgba(20,12,18,0.62)] border border-[rgba(255,255,255,0.08)] text-[rgba(245,240,242,0.65)] hover:bg-[rgba(40,24,32,0.62)]"
                >
                  <span className="block text-lg mb-0.5 select-none">{preset.emoji}</span>
                  {preset.label}
                </button>
              ))}
            </div>

            {/* ── 底部设备状态卡片 */}
            <DeviceStatusFooter />

          </div>
        )}

      </div>

      {/* ── 剧本详情弹窗 ──────────────────────────────────────── */}
      {showScriptDetail && activeScript && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.65)' }}
          onClick={() => setShowScriptDetail(false)}
        >
          <div
            className="w-full max-w-[430px] max-h-[calc(100vh-1rem)] overflow-y-auto rounded-t-3xl px-5 pt-5 pb-24 animate-fadeUp"
            style={{ background: 'linear-gradient(180deg, #1e0f1a 0%, #120a18 100%)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* 顶部把手 */}
            <div className="w-10 h-1 rounded-full bg-[rgba(255,255,255,0.15)] mx-auto mb-5" />

            {/* 剧本名称 */}
            <div className="flex items-start gap-3 mb-5">
              <span className="text-4xl select-none leading-none">{displayEmoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-[rgba(245,240,242,0.95)] leading-snug mb-0.5">
                  {activeScript.name}
                </p>
                <span className="text-[10px] bg-[rgba(255,154,203,0.15)] text-[#FF9ACB] rounded-full px-2 py-0.5">
                  {activeScript.tag}
                </span>
              </div>
            </div>

            {/* 剧本简介长文案 */}
            {activeChar && SCRIPT_DESCRIPTIONS[activeChar.id] && (
              <div className="rounded-2xl p-4 mb-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)]">
                <p className="text-[9px] text-[rgba(245,240,242,0.35)] tracking-widest mb-2">剧本简介</p>
                <p className="text-[11px] text-[rgba(245,240,242,0.72)] leading-relaxed">
                  {SCRIPT_DESCRIPTIONS[activeChar.id]}
                </p>
              </div>
            )}

            {/* 角色信息 */}
            {activeChar && (
              <div className="rounded-2xl p-4 mb-3 bg-[rgba(255,154,203,0.06)] border border-[rgba(255,154,203,0.1)]">
                <p className="text-[9px] text-[rgba(245,240,242,0.35)] tracking-widest mb-2">角色</p>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl select-none">{activeChar.emoji}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[rgba(245,240,242,0.9)]">{activeChar.name}</p>
                    <p className="text-[10px] text-[rgba(179,128,255,0.8)]">{activeChar.tag}</p>
                  </div>
                </div>
                <p className="text-[11px] text-[rgba(245,240,242,0.55)] italic leading-relaxed">
                  "{activeChar.intro}"
                </p>
              </div>
            )}

            {/* 场景信息 */}
            {activeScene && (
              <div className="rounded-2xl p-4 mb-5 bg-[rgba(179,128,255,0.06)] border border-[rgba(179,128,255,0.1)]">
                <p className="text-[9px] text-[rgba(245,240,242,0.35)] tracking-widest mb-2">场景</p>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl select-none">{activeScene.emoji}</span>
                  <p className="text-[13px] font-semibold text-[rgba(245,240,242,0.9)]">{activeScene.name}</p>
                </div>
                <p className="text-[11px] text-[rgba(245,240,242,0.55)] italic leading-relaxed">
                  {activeScene.ambiance.idle}
                </p>
              </div>
            )}

            {/* 关闭按钮 */}
            <button
              onClick={() => setShowScriptDetail(false)}
              className="w-full py-3 rounded-2xl text-[13px] font-medium text-[rgba(245,240,242,0.6)] bg-[rgba(255,255,255,0.07)] active:scale-[0.98] transition-all"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 满屏心形飘落 */}
      {showHearts && <HeartRain hearts={hearts} />}
    </div>
  )
}
