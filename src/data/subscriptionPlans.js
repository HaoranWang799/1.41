// TODO: 接入 /api/membership/plans 获取真实订阅方案
export const SUBSCRIPTION_PLANS = [
  {
    name: '极乐·Premium',
    nameEn: 'Ecstasy · Premium',
    price: '$19.99',
    features: ['无限制 AI 互动', '失控极乐模式', '器官物理调校', '定制低语'],
    featuresEn: ['Unlimited AI Interaction', 'Uncontrolled Ecstasy Mode', 'Physical Calibration', 'Custom Whispers'],
    color: '#FFC266',
    labelColor: '#1A0A00',
    bg: 'from-[#2A1A33] to-[#1E1324]',
    hot: true,
  },
  {
    name: '沉醉·Plus',
    nameEn: 'Indulgence · Plus',
    price: '$9.99',
    features: ['每日 30 次深度互动', '高阶隐藏剧本', '声画随动震频'],
    featuresEn: ['30 Deep Interactions Daily', 'Advanced Hidden Scripts', 'Audio-Visual Sync Vibration'],
    color: '#FF7DAF',
    labelColor: '#FFFFFF',
    bg: 'from-[#1E1324] to-[#0C060B]',
    hot: false,
  },
]
