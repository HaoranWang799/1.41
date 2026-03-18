import { useNavigate } from 'react-router-dom'
import './WelcomePage.css'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <h1 className="welcome-title">波波Nice</h1>
        <p className="welcome-subtitle">她在这里，等你</p>
        <p className="welcome-desc">
          选择一位角色，选一个场景<br />
          让情绪有处安放
        </p>
        <button
          className="welcome-btn"
          onClick={() => navigate('/role')}
        >
          开始
        </button>
      </div>
      <div className="welcome-bg-gradient" />
    </div>
  )
}
