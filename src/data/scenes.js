/**
 * 场景数据 — 统一数据源
 * HomePage 互动选择 & 场景氛围共用
 * TODO: 替换为 /api/scenes 的真实数据
 */
export const SCENES = [
  {
    id: 'office',
    name: '办公室',
    nameEn: 'Office',
    emoji: '🏢',
    overlayRgb: '255, 180, 80',
    ambiance: {
      idle: '格子间的灯光昏黄，键盘声渐渐停了…',
      warm: '加班的气息里，暗流在涌动…',
      hot:  '夜深了，窗外的城市还在喧嚣，这里只剩彼此…',
    },
    ambianceEn: {
      idle: 'Dim cubicle lights, the clatter of keyboards fading away...',
      warm: 'In the overtime air, hidden currents stir...',
      hot:  'Late night, the city still buzzes outside, but here it\'s just the two of you...',
    },
  },
  {
    id: 'dorm',
    name: '宿舍',
    nameEn: 'Dormitory',
    emoji: '🛏️',
    overlayRgb: '200, 80, 200',
    ambiance: {
      idle: '风扇嗡嗡作响，空气里弥漫着熟悉的气息…',
      warm: '被子的温度越来越高，呼吸也乱了…',
      hot:  '只有你们两个人，时间好像停住了…',
    },
    ambianceEn: {
      idle: 'The fan hums softly, a familiar scent fills the air...',
      warm: 'The warmth under the blanket rises, breathing quickens...',
      hot:  'Just the two of you, time seems to stand still...',
    },
  },
  {
    id: 'park',
    name: '公园',
    nameEn: 'Park',
    emoji: '🌿',
    overlayRgb: '100, 190, 100',
    ambiance: {
      idle: '落叶轻飘，夕阳把一切都染得暖橙色…',
      warm: '风带走了你的话，留下的只有心跳…',
      hot:  '天色暗下来了，你们还没有离开…',
    },
    ambianceEn: {
      idle: 'Leaves drift gently, sunset paints everything warm orange...',
      warm: 'The wind carries your words away, leaving only heartbeats...',
      hot:  'Darkness falls, yet neither of you has left...',
    },
  },
  {
    id: 'balcony',
    name: '夜晚阳台',
    nameEn: 'Night Balcony',
    emoji: '🌃',
    overlayRgb: '80, 120, 255',
    ambiance: {
      idle: '夜风微凉，月光洒在你的脸上…',
      warm: '星星都在看着你们，什么都藏不住…',
      hot:  '城市的噪音消失了，只听得到彼此的呼吸…',
    },
    ambianceEn: {
      idle: 'Cool night breeze, moonlight dancing on your face...',
      warm: 'Stars watching over you both, nothing can be hidden...',
      hot:  'City noise fades away, only the sound of each other\'s breathing remains...',
    },
  },
]
