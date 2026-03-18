/**
 * App.jsx — 路由入口 v2
 *
 * 变更（v2）：
 *   • 引入 AppProvider（全局货币 + 会员等级状态）
 *   • 新增 /recharge 路由（位于 Layout 外，无底部导航）
 *
 * TODO: 添加用户账户系统与亲密度持久化（localStorage / 后端 API）
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider }   from './context/AppContext'
import Layout            from './components/Layout'
import HomePage          from './pages/HomePage'
import ShopPage          from './pages/ShopPage'
import CommunityPage     from './pages/CommunityPage'
import HealthPage        from './pages/HealthPage'
import RechargePage      from './pages/RechargePage'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* 带底部导航的主布局 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home"      element={<HomePage />} />
          <Route path="shop"      element={<ShopPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="health"    element={<HealthPage />} />
        </Route>

        {/* 充值与会员页（全屏独立，无底部导航） */}
        <Route path="/recharge" element={<RechargePage />} />

        {/* 兜底 */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AppProvider>
  )
}
