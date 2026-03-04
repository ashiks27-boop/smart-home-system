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

        <div className="prediction-header">
          <h1>Prediction Overview</h1>
        </div>

        <div className="prediction-grid">

         <div className="prediction-grid">

  {/* LIGHT */}
  <div
    className="prediction-card"
    onClick={() => navigate("/predictive/light")}
  >
    <div className="prediction-icon light-icon"></div>
    <h3>Light Usage Prediction</h3>
    <p>
      Forecast smart light usage patterns to automate
      energy-efficient schedules.
    </p>
  </div>
{/* FAN */}
<div
  className="prediction-card"
 onClick={() => navigate("/fan-prediction")}
>
  <div className="prediction-icon fan-icon"></div>

  <h3>Fan Usage Prediction</h3>

  <p>
    Predict smart fan usage trends to optimize cooling
    and reduce energy costs.
  </p>
</div>


{/* TIME */}
<div
  className="prediction-card"
  onClick={() => navigate("/predictive/time")}
>
  <div className="prediction-icon time-icon"></div>
  <h3>Device Time Prediction</h3>
  <p>
    Predict when devices will turn ON and OFF based on past usage patterns.
  </p>
</div>

  {/* POWER */}
  <div
    className="prediction-card"
    onClick={() => navigate("/predictive/power")}
  >
    <div className="prediction-icon power-icon"></div>
    <h3>Power Usage Prediction</h3>
    <p>
      Predict and optimize power consumption trends
      for your connected devices.
    </p>
  </div>

  {/* WEATHER */}
  <div
    className="prediction-card"
    onClick={() => navigate("/predictive/weather")}
  >
    <div className="prediction-icon weather-icon"></div>
    <h3>Weather & Temperature Prediction</h3>
    <p>
      Anticipate weather changes and temperature fluctuations
      to optimize climate control.
    </p>
  </div>

</div>
        </div>

      </div>
    </div>
  )
}