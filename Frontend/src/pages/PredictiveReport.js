import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function PredictiveReport() {

  const navigate = useNavigate()

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
          
          <li onClick={() => navigate("/resident/feedback")}>Feedback </li>
          <li onClick={() => navigate("/resident/update-log")}>Updates</li>
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

        <div className="reports-header">
          <h1>Predictive Report Overview</h1>
        </div>


        {/* REPORT CARDS */}
        <div className="reports-grid">

          {/* LIGHT */}
          <div
            className="report-card"
            onClick={() => navigate("/predictive/light")}
          >
            <div className="report-icon">💡</div>

            <h3>Light Usage Prediction</h3>

            <p>
              Forecast smart light usage patterns
              to automate energy-efficient schedules.
            </p>
          </div>


          {/* FAN */}
          <div
            className="report-card"
            onClick={() => navigate("/fan-prediction")}
          >
            <div className="report-icon">✇</div>

            <h3>Fan Usage Prediction</h3>

            <p>
              Predict smart fan usage trends to
              optimize cooling and reduce energy costs.
            </p>
          </div>


          {/* DEVICE TIME */}
          <div
            className="report-card"
            onClick={() => navigate("/predictive/time")}
          >
            <div className="report-icon">⏱</div>

            <h3>Device Time Prediction</h3>

            <p>
              Predict when devices will turn ON and OFF
              based on past usage patterns.
            </p>
          </div>


          {/* POWER */}
          <div
            className="report-card"
            onClick={() => navigate("/predictive/power")}
          >
            <div className="report-icon">⚡</div>

            <h3>Power Usage Prediction</h3>

            <p>
              Predict and optimize power consumption
              trends for your connected devices.
            </p>
          </div>


          {/* WEATHER */}
          <div
            className="report-card"
            onClick={() => navigate("/predictive/weather")}
          >
            <div className="report-icon">🌤</div>

            <h3>Weather & Temperature Prediction</h3>

            <p>
              Anticipate weather changes and temperature
              fluctuations to optimize climate control.
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}