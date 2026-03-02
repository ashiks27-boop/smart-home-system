import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import "./Auth.css"

export default function PowerPrediction() {

  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState("")
  const [viewType, setViewType] = useState("single")

  /* FETCH DEVICES */
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) return

    fetch(`http://localhost:5000/api/devices/${userId}`)
      .then(res => res.json())
      .then(data => {
        setDevices(data)
      })
  }, [])

  /* GET SELECTED DEVICE NAME */
  const selectedDeviceName =
    devices.find(d => d._id === selectedDevice)?.name || ""

  return (
    <div className="dashboard-dark">

      {/* ===== SIDEBAR ===== */}
      <div className="dark-sidebar">

        <div className="smart-home-logo">
          <div className="smart-icon">💎</div>
          <div className="smart-text">
            <span>Smart</span>
            <span>Home</span>
          </div>
        </div>

        <ul>
          <li onClick={() => navigate("/resident")}>Dashboard</li>
          <li onClick={() => navigate("/devices")}>Devices</li>
          <li onClick={() => navigate("/reports")}>Reports</li>
          <li className="active">Predictive Reports</li>
          <li>Feedback and Update Log</li>
          <li>Settings</li>
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

      {/* ===== MAIN ===== */}
      <div className="dark-main">

        <h2 className="premium-report-header">
          ⚡ Power Usage Prediction Tool
        </h2>

        <div className="details-layout">

          {/* ===== LEFT PANEL ===== */}
          <div className="details-card">

            <h4>Select Date for Prediction</h4>

            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
            />

            <div style={{ marginTop: 20 }}>
              <h4>⚡ Select Device</h4>

              <div className="premium-select-wrapper">
                <select
                  className="premium-select-modern"
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                >
                  <option value="">-- Select a Device --</option>
                  {devices.map(device => (
                    <option key={device._id} value={device._id}>
                      {device.name}
                    </option>
                  ))}
                </select>
                <span className="select-glow"></span>
              </div>
            </div>

          </div>

          {/* ===== RIGHT PANEL ===== */}
          <div className="details-card">

            <h4>
              📊 Prediction for {selectedDeviceName || "-- Select a Device --"}
            </h4>

            <div style={{ marginTop: 15 }}>
              <label>View: </label>

              <div className="premium-select-wrapper" style={{ marginTop: 8 }}>
                <select
                  className="premium-select-modern"
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value)}
                >
                  <option value="single">Single Day</option>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                </select>
                <span className="select-glow"></span>
              </div>
            </div>

            <button
              className="premium-btn"
              style={{ marginTop: 15 }}
            >
              🚀 Fetch Predictions for {selectedDate.toLocaleDateString()}
            </button>

            <p style={{ marginTop: 15, opacity: 0.7 }}>
              Select a date and view type, then click 'Fetch Predictions'.
            </p>

          </div>

        </div>

      </div>
    </div>
  )
}