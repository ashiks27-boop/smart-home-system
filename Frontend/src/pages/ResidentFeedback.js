import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function ResidentFeedback() {

  const navigate = useNavigate()
  const [message, setMessage] = useState("")

  const handleSubmit = async () => {
    if (!message.trim()) return

    await fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        message
      })
    })

    setMessage("")
    alert("Feedback submitted successfully!")
  }

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
          
          <li onClick={() => navigate("/resident/update-log")}>Updates </li>
          
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

      <div className="dark-main">
        <h2 className="premium-report-header">
          💬 Submit Feedback
        </h2>

        <div className="details-card">

          <textarea
            rows="4"
            placeholder="Describe your issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="update-input"
          />

          <button
            className="premium-btn"
            style={{ marginTop: 15 }}
            onClick={handleSubmit}
          >
            Submit Feedback
          </button>

        </div>
      </div>
    </div>
  )
}