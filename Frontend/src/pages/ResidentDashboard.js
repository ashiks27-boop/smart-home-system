import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { Row, Col, Card } from "react-bootstrap"
import "./Auth.css"

const API_URL = "http://localhost:5000/api/devices"

export default function ResidentDashboard() {

  const navigate = useNavigate()
  const location = useLocation()

  const userName = localStorage.getItem("userName") || "Resident"
  const userId = localStorage.getItem("userId")

  const [weather, setWeather] = useState(null)
  const [devices, setDevices] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  /* WEATHER */
  useEffect(() => {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=Kochi&units=metric&appid=26f91944c05379b0585f37cb2cb61263")
      .then(res => res.json())
      .then(data => data?.main && setWeather(data))
  }, [])

  /* CLOCK */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  /* FETCH DEVICES */
  useEffect(() => {
    const fetchDevices = async () => {
      const res = await fetch(`${API_URL}/${userId}`)
      const data = await res.json()
      setDevices(Array.isArray(data) ? data : [])
    }

    if (userId) fetchDevices()
  }, [userId])

  /* UNIQUE LOCATIONS */
  const locations = [...new Set(devices.map(d => d.location || "Room1"))]

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
          <li onClick={() => navigate("/devices")}>Devices</li>
          <li onClick={() => navigate("/locations")}>Locations</li>
          <li onClick={() => navigate("/device-details")}>Device Details</li>
          <li onClick={() => navigate("/reports")}>Reports</li>
          <li onClick={() => navigate("/predictive")}>Predictive Report</li>
          
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

        {/* HEADER */}
        <div className="locations-header premium-header">
          <h2>Resident Dashboard</h2>
        </div>

        {/* WEATHER CARD */}
        <Row className="mb-4">
          <Col>
            <Card className="weather-premium-card">
              <Card.Body>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <h4>Kochi</h4>
                    <h1>{weather?.main?.temp?.toFixed(1) || "--"}°C</h1>
                    <p style={{ textTransform: "capitalize" }}>
                      {weather?.weather?.[0]?.description || "Loading..."}
                    </p>
                    <p>💧 {weather?.main?.humidity || "--"}% | 💨 {weather?.wind?.speed || "--"} m/s</p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <h3>{currentTime.toLocaleTimeString()}</h3>
                    <p>{currentTime.toLocaleDateString()}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* QUICK ACCESS */}
        <div className="dark-panel">
          <h3>Quick Access</h3>

          <div className="quick-grid">
            {devices.slice(0, 4).map((d, i) => (
              <div
                key={i}
                className="quick-card"
                onClick={() =>
                  navigate("/device-details", {
                    state: d   // ✅ PASS DEVICE DIRECTLY
                  })
                }
              >
                <div className="quick-icon">
                  {d.type === "bulb"
                    ? "💡"
                    : d.type === "ac"
                    ? "❄"
                    : "🔌"}
                </div>
                <h4>{d.name}</h4>
                <p>{d.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LOCATIONS */}
        <div className="dark-panel">
          <h3>Manage Home Locations</h3>

          <div className="location-grid">
            {locations.map((loc, i) => (
              <div
                key={i}
                className="location-card"
                onClick={() =>
                  navigate("/locations", { state: { selectedRoom: loc } })
                }
                style={{ cursor: "pointer" }}
              >
                {loc}
              </div>
            ))}
          </div>

          <button
            className="premium-btn"
            onClick={() => navigate("/locations")}
          >
            Manage Locations
          </button>
        </div>

      </div>
    </div>
  )
}