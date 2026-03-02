import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function UpdateLog() {
  const navigate = useNavigate()

  const [message, setMessage] = useState("")
  const [type, setType] = useState("System")
  const [loading, setLoading] = useState(true)
  const [updates, setUpdates] = useState([])

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  useEffect(() => {
    fetch("http://localhost:5000/api/updates")
      .then(res => res.json())
      .then(data => {
        setUpdates(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!message.trim()) return

    await fetch("http://localhost:5000/api/updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, type })
    })

    setMessage("")
    window.location.reload()
  }

  return (
    <div className="admin-dark-layout">

      {/* SIDEBAR */}
      <div className="admin-dark-sidebar">
        <div>
          <div className="admin-dark-logo">💎 Smart Home</div>

          <ul>
            <li onClick={() => navigate("/admin")}>
              📊 Dashboard
            </li>

            <li className="active" onClick={() => navigate("/admin/update-log")}>
              📝 Update Log
            </li>
          </ul>
        </div>

        <button className="admin-dark-logout" onClick={logout}>
          ⏻ Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="admin-dark-main">
<div className="locations-header premium-header">
        <h2 className="page-title">System Updates</h2></div>

        <div className="update-card">
          <h4>Add Update</h4>

          <input
            type="text"
            placeholder="Log message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="update-input"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="update-select"
          >
            <option value="System">System</option>
            <option value="Security">Security</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <button className="update-btn" onClick={handleSubmit}>
            Submit Update
          </button>
        </div>

        <div className="updates-section">
          {loading ? (
            <p className="loading-text">Loading updates...</p>
          ) : (
            updates.map((item, index) => (
              <div key={index} className="update-item">
                <div className="update-type">{item.type}</div>
                <div className="update-message">{item.message}</div>
                <div className="update-date">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}