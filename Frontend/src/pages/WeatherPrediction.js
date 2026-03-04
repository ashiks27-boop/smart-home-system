import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import "./Auth.css"

export default function WeatherPrediction() {

  const navigate = useNavigate()

  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // 🔥 Replace with your backend API
  const API_URL = "http://localhost:5000/api/weather"

  useEffect(() => {
    fetchWeather()
  }, [])

  const fetchWeather = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()

      setWeather(data.current)
      setForecast(data.forecast)
      setLoading(false)
    } catch (err) {
      setError("Failed to load weather data")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-dark">
        <div className="dark-main">
          <h2>Loading Weather Data...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-dark">
        <div className="dark-main">
          <h2>{error}</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-dark">
      <div className="dark-main">

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2>🌤 Weather & Temperature Prediction</h2>

        {/* Current Weather */}
        <div className="weather-grid">

          <div className="weather-card">
            <h3>🌡 Temperature</h3>
            <p>{weather.temperature} °C</p>
          </div>

          <div className="weather-card">
            <h3>💧 Humidity</h3>
            <p>{weather.humidity}%</p>
          </div>

          <div className="weather-card">
            <h3>🌬 Wind Speed</h3>
            <p>{weather.windSpeed} km/h</p>
          </div>

          <div className="weather-card">
            <h3>🌦 Condition</h3>
            <p>{weather.condition}</p>
          </div>

        </div>

        {/* Temperature Trend Chart */}
        <div className="details-card">
          <h3>📈 5-Day Temperature Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#4da6ff"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast Cards */}
        <div className="forecast-grid">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-card">
              <h4>{day.day}</h4>
              <p>{day.temperature} °C</p>
              <p>{day.condition}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}