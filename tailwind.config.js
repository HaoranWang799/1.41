/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 品牌强调色
        rose: {
          accent: '#FF9ACB',
          soft: 'rgba(255,154,203,0.15)',
        },
        purple: {
          accent: '#B380FF',
          soft: 'rgba(179,128,255,0.15)',
        },
        // 深色背景层次
        dark: {
          900: '#0C0A0C',
          800: '#1A1318',
          700: '#231B20',
          card: 'rgba(30,20,25,0.6)',
        },
      },
      keyframes: {
        // 角色头像呼吸动画
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.95' },
          '50%':       { transform: 'scale(1.03)', opacity: '1' },
        },
        // 点击头像脉冲放大
        avatarPop: {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)' },
        },
        // 淡入上移
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        // 设备通知浮现
        notifIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px) scale(0.95)' },
          '20%':  { opacity: '1', transform: 'translateY(0) scale(1)' },
          '80%':  { opacity: '1' },
          '100%': { opacity: '0' },
        },
        // 语音波形跳动
        waveBar: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%':      { transform: 'scaleY(1)' },
        },
        // 心形飘落
        heartFall: {
          '0%':   { transform: 'translateY(-20px) rotate(var(--rot, 0deg))', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(var(--rot, 30deg))', opacity: '0' },
        },
        // 温度条填充
        barGlow: {
          '0%, 100%': { boxShadow: '0 0 6px rgba(255,154,203,0.4)' },
          '50%':      { boxShadow: '0 0 14px rgba(255,154,203,0.8)' },
        },
      },
      animation: {
        breathe:     'breathe 3s ease-in-out infinite',
        avatarPop:   'avatarPop 0.3s ease-out',
        fadeUp:      'fadeUp 0.35s ease-out',
        notifIn:     'notifIn 1.2s ease-out forwards',
        waveBar1:    'waveBar 0.7s ease-in-out infinite',
        waveBar2:    'waveBar 0.7s ease-in-out 0.12s infinite',
        waveBar3:    'waveBar 0.7s ease-in-out 0.24s infinite',
        waveBar4:    'waveBar 0.7s ease-in-out 0.36s infinite',
        waveBar5:    'waveBar 0.7s ease-in-out 0.48s infinite',
        heartFall:   'heartFall var(--dur, 3s) ease-in forwards',
        barGlow:     'barGlow 2s ease-in-out infinite',
      },
      backgroundImage: {
        // App 主背景
        'app-bg': 'radial-gradient(ellipse at 60% 20%, #2a1422 0%, #0C0A0C 60%, #0e0c14 100%)',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}
