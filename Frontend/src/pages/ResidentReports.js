import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

const API_URL = "http://localhost:5000/api/devices"

export default function ResidentReports() {

  const navigate = useNavigate()
  const userId = localStorage.getItem("userId")

  const [devices, setDevices] = useState([])

  useEffect(() => {
    if (!userId) navigate("/")
  }, [userId, navigate])

  useEffect(() => {
    const fetchDevices = async () => {
      const res = await fetch(`${API_URL}/${userId}`)
      const data = await res.json()
      setDevices(Array.isArray(data) ? data : [])
    }
    if (userId) fetchDevices()
  }, [userId])

  const totalUsage = devices.reduce((sum, d) => sum + (d.totalOn || 0), 0)

  const formatTime = (seconds = 0) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}h ${m}m`
  }

  const totalKwh = (totalUsage / 3600 * 0.5).toFixed(2)

  return (
    <div className="dashboard-layout">

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

      <div className="dashboard-main">

        <div className="locations-header premium-header">
          <h2 className="page-title premium-title">Reports Overview</h2>
        </div>

        <div className="reports-grid">

          <div className="report-card"
           onClick={() => navigate("/reports/fan")}
           style={{ cursor: "pointer" }}>
            <div className="report-icon">🌀</div>
            <h3>Fan Usage Report</h3>
            <p>View detailed fan usage insights</p>
          </div>

          <div className="report-card"
           onClick={() => navigate("/reports/light")}
           style={{ cursor: "pointer" }}>
            <div className="report-icon">💡</div>
            <h3>Light Usage Report</h3>
            <p>Analyze lighting usage patterns</p>
          </div>

          <div className="report-card"
           onClick={() => navigate("/reports/energy")}
           style={{ cursor: "pointer" }}>
            <div className="report-icon">⚡</div>
            <h3>Energy Consumption</h3>
            <p>Total Usage: {formatTime(totalUsage)}</p>
            <p>Total Energy: {totalKwh} kWh</p>
          </div>

          <div className="report-card"
           onClick={() => navigate("/reports/thermostat")}
           style={{ cursor: "pointer" }}>
            <div className="report-icon">🌡️</div>
            <h3>Thermostat Report</h3>
            <p>Temperature automation analytics</p>
          </div>

        </div>
      </div>
    </div>
  )
}