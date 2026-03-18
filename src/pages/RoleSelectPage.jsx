import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { characters } from '../data/characters'
import './RoleSelectPage.css'

export default function RoleSelectPage() {
  const navigate = useNavigate()
  const { setSelectedCharacter } = useApp()

  const handleSelect = (char) => {
    setSelectedCharacter(char)
    navigate('/scene')
  }

  return (
    <div className="role-select-page">
      <div className="page-header">
        <h1>选择角色</h1>
        <p>她将陪你度过这段时光</p>
      </div>
      <div className="role-grid">
        {characters.map((char) => (
          <button
            key={char.id}
            className="role-card"
            onClick={() => handleSelect(char)}
          >
            <div className="role-avatar">{char.avatar}</div>
            <h3>{char.name}</h3>
            <div className="role-tags">
              {char.personalityTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <p className="role-tone">{char.toneDescription}</p>
          </button>
        ))}
      </div>
      <button className="back-btn" onClick={() => navigate('/')}>
        返回
      </button>
    </div>
  )
}
