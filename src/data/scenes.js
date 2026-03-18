/**
 * 场景配置 - 集中管理
 * 影响背景色调、环境描述、互动氛围
 */

export const scenes = [
  {
    id: 'office',
    name: '办公室',
    backgroundStyle: {
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      accentColor: '#e94560',
      warmAccent: '#ff6b6b',
    },
    ambientDescription: '夜深了，办公室里只剩下你们。空调的嗡鸣、键盘的余温，还有她指尖敲击桌面的声音。',
  },
  {
    id: 'dorm',
    name: '宿舍',
    backgroundStyle: {
      gradient: 'linear-gradient(135deg, #2d1b4e 0%, #1a0a2e 50%, #0d0221 100%)',
      accentColor: '#a855f7',
      warmAccent: '#c084fc',
    },
    ambientDescription: '熄灯后的宿舍，月光从窗帘缝隙挤进来。她的床铺传来轻微翻身的声响，还有若有若无的香气。',
  },
  {
    id: 'park',
    name: '公园',
    backgroundStyle: {
      gradient: 'linear-gradient(135deg, #0d2137 0%, #134e5c 50%, #1a5f4a 100%)',
      accentColor: '#2dd4bf',
      warmAccent: '#5eead4',
    },
    ambientDescription: '夜风吹过树梢，长椅上只有你们两人。远处的路灯昏黄，她的发丝被风轻轻撩起。',
  },
  {
    id: 'balcony',
    name: '夜晚阳台',
    backgroundStyle: {
      gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
      accentColor: '#818cf8',
      warmAccent: '#a78bfa',
    },
    ambientDescription: '城市灯火在脚下铺开，晚风带着一丝凉意。她靠在栏杆上，侧脸被月光镀了一层银边。',
  },
]
