import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function AdminFeedback() {
  const navigate = useNavigate()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  useEffect(() => {
    fetch("http://localhost:5000/api/feedback")
      .then(res => res.json())
      .then(data => {
        setFeedbacks(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="admin-dark-layout">

       {/* SIDEBAR */}
      <div className="dark-sidebar">

        <div className="smart-home-logo">
          <div className="smart-icon">💎</div>
          <div className="smart-text">
            <span>Smart</span>
            <span>Home</span>
          </div>
        </div>

         <ul>
          <li onClick={() => navigate("/admin")}>
              📊 Dashboard
            </li>
          <li onClick={() => navigate("/admin/update-log")}>📝 Update Log</li>
          <li onClick={() => navigate("/admin/feedback")}>💬 User Feedback</li>
        </ul>

        <button
  className="premium-logout-btn"
  onClick={() => {
    localStorage.clear()
    navigate("/")
  }}
>
  ⏻ Logout
</button>
      </div>

      {/* MAIN */}
      <div className="admin-dark-main">
           <div className="locations-header premium-header">
        <h2 className="page-title">Reported System Issues</h2>
</div>
        <div className="update-card">
          <h4>Open Feedback</h4>

          {loading ? (
            <p className="loading-text">Loading feedback...</p>
          ) : feedbacks.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No feedback available.</p>
          ) : (
            feedbacks.map((item, index) => (
              <div key={index} className="update-item">
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