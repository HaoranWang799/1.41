import { Zap, Shield, Heart, Settings } from 'lucide-react'

// TODO: 接入 /api/help/categories + /api/help/articles 获取真实内容
export const HELP_CATEGORIES = [
  { icon: Zap,      label: '新手入门',   labelEn: 'Getting Started',      count: '4 篇文章', countEn: '4 Articles', color: '#A87CFF', bg: 'rgba(168,124,255,0.1)' },
  { icon: Shield,   label: '隐私与安全', labelEn: 'Privacy & Security',    count: '4 篇文章', countEn: '4 Articles', color: '#FF4D6D', bg: 'rgba(255,77,109,0.1)'  },
  { icon: Heart,    label: '功能介绍',   labelEn: 'Features',              count: '4 篇文章', countEn: '4 Articles', color: '#FF7DAF', bg: 'rgba(255,125,175,0.1)' },
  { icon: Settings, label: '帐户与设置', labelEn: 'Account & Settings',   count: '3 篇文章', countEn: '3 Articles', color: '#66E699', bg: 'rgba(102,230,153,0.1)' },
]

export const HELP_ARTICLES = {
  '新手入门': [
    { title: '如何连接您的 Luna 硬件？', titleEn: 'How to connect your Luna hardware?', content: '打开手机蓝牙，长按 Luna 设备底部的 AI 呼吸灯键 3 秒直到蓝光闪烁。在 App 的「感官互联」页面点击「添加新伴侣」，系统将自动发现并完成配对。连接成功后，设备会发出轻微震动反馈。', contentEn: 'Turn on your phone\'s Bluetooth, then press and hold the AI breathing light button at the bottom of your Luna device for 3 seconds until the blue light flashes. In the app\'s "Sensory Connect" page, tap "Add New Companion" and the system will automatically discover and pair with the device. Upon successful connection, the device will provide gentle vibration feedback.' },
    { title: '第一次互动前需要做哪些准备？', titleEn: 'What preparations are needed before your first interaction?', content: '我们建议您在开始前先开启「肌肤恒温」功能进行 3 分钟预热。此外，确保设备电量在 20% 以上，并佩戴耳机以获得完整的 4D ASMR 沉浸音效支持。', contentEn: 'We recommend enabling the "Skin Thermostat" feature for a 3-minute warm-up before starting. Also, ensure the device battery is above 20% and wear headphones for the full 4D ASMR immersive audio experience.' },
    { title: '关于充电与状态指示灯', titleEn: 'About charging and status indicator lights', content: '使用随附的磁吸充电线。充电时红灯常亮，充满后转为绿灯。如果指示灯呈橙色闪烁，代表电量即将耗尽，请及时补充体力以防断连。', contentEn: 'Use the included magnetic charging cable. A red light stays on during charging and turns green when fully charged. An orange flashing indicator means the battery is nearly depleted—please recharge promptly to prevent disconnection.' },
    { title: '新手推荐剧本引导', titleEn: 'Recommended starter script guide', content: '建议从「温柔乡：耳畔的呢喃」开始。该剧本震动频率温和，伴随舒缓的语音引导，能帮助您更好地适应硬件随动技术。', contentEn: 'We recommend starting with "Tender Haven: Whispers in Your Ear." This script features gentle vibration frequencies with soothing voice guidance to help you better adapt to the hardware synchronization technology.' },
  ],
  '隐私与安全': [
    { title: '我的私密互动数据安全吗？', titleEn: 'Is my intimate interaction data safe?', content: '绝对安全。Luna 采用 AES-256 军工级端到端加密协议。您的所有聊天记录、感官偏好和硬件频率数据仅存储在您的手机本地安全芯片中，我们服务器无法解密任何私密内容。', contentEn: 'Absolutely safe. Luna uses AES-256 military-grade end-to-end encryption. All your chat records, sensory preferences, and hardware frequency data are stored only on your phone\'s local security chip. Our servers cannot decrypt any private content.' },
    { title: '什么是「摇一摇瞬间锁定」？', titleEn: 'What is "Shake to Instantly Lock"?', content: '当您在紧急情况下剧烈摇晃手机，应用将立即关闭屏幕、切断所有音频，并强制断开硬件连接。您可以在「隐私设置」中调节触发灵敏度。', contentEn: 'When you vigorously shake your phone in an emergency, the app will immediately turn off the screen, cut all audio, and force-disconnect the hardware. You can adjust the trigger sensitivity in "Privacy Settings".' },
    { title: '伪装模式说明', titleEn: 'Disguise Mode', content: '开启伪装模式后，应用图标将变为普通的天气或日历应用，且系统推送将伪装为「天气提醒」或「日程通知」，最大化守护您的深夜秘密。', contentEn: 'When Disguise Mode is enabled, the app icon changes to a generic weather or calendar app, and system notifications are disguised as "Weather Alerts" or "Schedule Reminders" to maximize privacy protection.' },
    { title: '如何彻底销毁痕迹？', titleEn: 'How to completely erase all traces?', content: '在「私密与安全锁」页面，您可以开启「退出即焚」。每当应用进入后台或被关闭，系统会自动清理所有缓存的剧本进度和临时互动指令。', contentEn: 'On the "Privacy & Security Lock" page, you can enable "Exit & Burn." Whenever the app enters the background or is closed, the system automatically clears all cached script progress and temporary interaction commands.' },
  ],
  '功能介绍': [
    { title: '硬件随动技术 (SyncTech)', titleEn: 'Hardware Sync Technology (SyncTech)', content: '这是 Luna 的核心。AI 会实时解析剧本中的音频频率和语义情感，将其转化为每秒 120 次的精细震动与夹吸指令。无论是轻柔的爱抚还是激烈的撞击，硬件都能完美同步。', contentEn: 'This is Luna\'s core technology. The AI analyzes audio frequencies and semantic emotions in scripts in real-time, converting them into precise vibration and suction commands at 120 times per second. Whether gentle caresses or intense thrusts, the hardware synchronizes perfectly.' },
    { title: '智能恒温加热系统', titleEn: 'Smart Constant Temperature Heating System', content: '内置柔性石墨烯加热膜，支持从 30℃ 到 42℃ 的精准温控。开启后，设备内壁将维持在最接近真实体温的 38.5℃，为您提供更真实的包裹感。', contentEn: 'Built-in flexible graphene heating film supports precise temperature control from 30°C to 42°C. Once activated, the device\'s inner wall maintains a temperature of 38.5°C—closest to real body temperature—providing a more realistic sensation.' },
    { title: '定制 AI 伴侣的人格灵魂', titleEn: 'Customize Your AI Companion\'s Personality', content: '您可以为 AI 注入不同的灵魂——温柔、御姐、病娇或冷艳。通过调节性格滑动条，AI 的对话语气和硬件反馈逻辑会随之发生微妙的变化。', contentEn: 'You can infuse your AI with different personalities—sweet, bossy, possessive, or cold. By adjusting personality sliders, the AI\'s dialogue tone and hardware feedback logic will subtly change accordingly.' },
    { title: 'ASMR 沉浸音频库', titleEn: 'ASMR Immersive Audio Library', content: '我们与顶级声优合作，录制了大量全景声互动音频。建议使用支持空间音频的耳机，体验仿佛伴侣就在耳边喘息的极致感官盛宴。', contentEn: 'We\'ve partnered with top voice actors to record extensive panoramic interactive audio. We recommend using headphones with spatial audio support for an ultimate sensory experience that feels like your companion is breathing right beside you.' },
  ],
  '帐户与设置': [
    { title: '订阅方案的管理与续费', titleEn: 'Subscription plan management and renewal', content: '在「私享订阅管理」中可以查看您的 Premium 到期时间。如果您需要调整方案或取消自动扣费，请在到期前 24 小时进行操作。', contentEn: 'You can view your Premium expiration date in "Subscription Management." If you need to adjust your plan or cancel auto-renewal, please do so at least 24 hours before expiration.' },
    { title: '支付隐密性保障', titleEn: 'Payment privacy protection', content: '我们承诺在您的银行账单上仅显示「Tech-Solution Services」等中性字样，绝对不含任何敏感词汇。我们同时也支持加密货币支付，实现 100% 匿名结算。', contentEn: 'We guarantee that only neutral terms like "Tech-Solution Services" will appear on your bank statement—absolutely no sensitive wording. We also support cryptocurrency payments for 100% anonymous transactions.' },
    { title: '多设备登录同步须知', titleEn: 'Multi-device login sync notice', content: '为了保证数据安全，同一时间仅支持 1 台设备连接硬件进行互动。如果更换设备登录，请先在原设备上点击「安全退出」。', contentEn: 'For data security, only 1 device can be connected to hardware for interaction at a time. If you switch devices, please tap "Secure Logout" on the original device first.' },
  ],
}

export const HELP_FAQS = [
  { q: '我的私密互动数据安全吗？', qEn: 'Is my intimate interaction data safe?', a: '绝对安全。Luna 采用端到端加密，所有敏感信息仅保存在您的本地安全芯片中，应用关闭即销毁缓存。', aEn: 'Absolutely safe. Luna uses end-to-end encryption. All sensitive information is stored only on your local security chip and cache is destroyed when the app closes.' },
  { q: '硬件和 AI 是如何联动的？', qEn: 'How do the hardware and AI work together?', a: 'AI 引擎会根据剧本的节奏、语气的强弱实时计算硬件频率，并通过低延迟蓝牙发送指令，确保触感与声画同步。', aEn: 'The AI engine calculates hardware frequencies in real-time based on the script\'s rhythm and tone, sending commands via low-latency Bluetooth to ensure tactile and audiovisual synchronization.' },
  { q: '恒温加热功能如何使用？', qEn: 'How do I use the constant temperature heating feature?', a: '在「感官互联」中开启加热开关。建议提前 3 分钟开启，使内壁均匀升温至 38.5℃ 的完美体温。', aEn: 'Turn on the heating switch in "Sensory Connect". We recommend activating it 3 minutes in advance for the inner wall to evenly warm to the perfect body temperature of 38.5°C.' },
]
