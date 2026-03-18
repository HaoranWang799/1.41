# 波波Nice - 情绪陪伴 Demo

情趣用品配套的情感陪伴 APP 概念 Demo。通过【角色 + 场景】的选择，营造情绪陪伴与互动体验。

## 说明

- **仅做 Demo 展示**：所有与硬件/情趣玩具的交互为模拟
- 无真实蓝牙、后端、语音模型
- 重点在沉浸感与可感知反馈
- 代码结构便于未来接入真实接口

## 技术栈

- React 18 + Vite 5
- React Router 6
- 纯 CSS 动画（无复杂依赖）

## 快速开始

```bash
npm install
npm run dev
```

## 页面流程

1. **欢迎页** → 2. **角色选择** → 3. **场景选择** → 4. **互动页**

未选择角色与场景不可进入互动页。

## 扩展预留

代码中已预留以下 TODO 注释，便于后续接入：

- `// TODO: Replace with real LLM API`
- `// TODO: Replace with real Bluetooth API`
- `// TODO: Replace with real Speech-to-Text API`
- `// TODO: Add user account & intimacy persistence`

## 项目结构

```
src/
├── api/mock.js          # 模拟接口（语音、LLM、蓝牙）
├── data/
│   ├── characters.js    # 角色配置
│   ├── scenes.js        # 场景配置
│   └── constants.js     # 常量
├── components/          # 通用组件
├── pages/               # 页面
└── styles/              # 样式
```
