import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function ResidentUpdateLog() {

  const navigate = useNavigate()
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:5000/api/updates")
      .then(res => res.json())
      .then(data => {
        setUpdates(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="dashboard-dark">

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
            <li onClick={() => navigate("/resident")}>Home</li>
          <li onClick={() => navigate("/devices")}>Devices</li>
          <li onClick={() => navigate("/locations")}>Locations</li>
          <li onClick={() => navigate("/device-details")}>Device Details</li>
          <li onClick={() => navigate("/reports")}>Reports</li>
          <li onClick={() => navigate("/predictive")}>Predictive Report</li>
          <li onClick={() => navigate("/resident/feedback")}>Feedback and Update Log</li>
          <li onClick={() => navigate("/resident/update-log")}>Update Log</li>
          
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
      <div className="dark-main">

        <h2 className="premium-report-header">
          📝 System Updates
        </h2>

        <div className="details-card">

          {loading ? (
            <p>Loading updates...</p>
          ) : updates.length === 0 ? (
            <p>No updates available.</p>
          ) : (
            updates.map((item, index) => (
              <div key={index} className="update-item">
                <div className="update-type">{item.type}</div>
                <div>{item.message}</div>
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