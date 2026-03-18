import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { scenes } from '../data/scenes'
import './SceneSelectPage.css'

export default function SceneSelectPage() {
  const navigate = useNavigate()
  const { selectedCharacter, setSelectedScene } = useApp()

  const handleSelect = (scene) => {
    setSelectedScene(scene)
    navigate('/interaction')
  }

  return (
    <div className="scene-select-page">
      <div className="page-header">
        <h1>选择场景</h1>
        <p>
          {selectedCharacter?.name} 将与你相遇在…
        </p>
      </div>
      <div className="scene-grid">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            className="scene-card"
            style={{
              '--scene-gradient': scene.backgroundStyle.gradient,
              '--scene-accent': scene.backgroundStyle.accentColor,
            }}
            onClick={() => handleSelect(scene)}
          >
            <div className="scene-preview" />
            <h3>{scene.name}</h3>
            <p>{scene.ambientDescription}</p>
          </button>
        ))}
      </div>
      <button className="back-btn" onClick={() => navigate('/role')}>
        返回
      </button>
    </div>
  )
}
