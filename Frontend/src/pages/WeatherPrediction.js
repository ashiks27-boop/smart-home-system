import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function WeatherPrediction() {

  const navigate = useNavigate()

  return (
    <div className="dashboard-dark">
      <div className="dark-main">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2>🌤 Weather & Temperature Prediction</h2>
        <div className="details-card">
          <p>Weather and climate prediction analytics will appear here.</p>
        </div>
      </div>
    </div>
  )
}