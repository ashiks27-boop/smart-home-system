import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import "./Auth.css"

export default function FanUsagePrediction() {

  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState("")
  const [viewType, setViewType] = useState("single")
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  /* FETCH FAN DEVICES */
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) return

    fetch(`http://localhost:5000/api/devices/${userId}`)
      .then(res => res.json())
      .then(data => {

        const fanDevices = data.filter(d =>
          d.name.toLowerCase().includes("fan")
        )

        setDevices(fanDevices)

      })
  }, [])

  /* GET SELECTED DEVICE NAME */
  const selectedDeviceName =
    devices.find(d => d._id === selectedDevice)?.name || ""

  /* PREDICTION FUNCTION */
  const fetchPrediction = async () => {

    if (!selectedDevice) {
      alert("Please select a device")
      return
    }

    setLoading(true)

    try {

      const res = await fetch(
        `http://localhost:5000/api/predict/${selectedDevice}`
      )

      const data = await res.json()

      if (data.message) {
        alert(data.message)
        setPrediction(null)
        setLoading(false)
        return
      }

      let updatedPrediction = { ...data }

      const selected = new Date(selectedDate)

      const avgUsageMinutes = data.averageUsageMinutes

      /* SINGLE DAY */
      if (viewType === "single") {

        updatedPrediction.predictedNextOnTime = selected

        updatedPrediction.predictedNextOffTime = new Date(
          selected.getTime() + (avgUsageMinutes * 60 * 1000)
        )

        updatedPrediction.nextDayKWh =
          data.nextDayKWh
      }

      /* WEEKLY */
      if (viewType === "week") {

        const weeklyUsage = data.nextDayKWh * 7

        updatedPrediction.nextWeekKWh =
          weeklyUsage.toFixed(2)

        updatedPrediction.estimatedWeeklyBill =
          (weeklyUsage * 6).toFixed(2)
      }

      /* MONTHLY */
      if (viewType === "month") {

        const monthlyUsage = data.nextDayKWh * 30

        updatedPrediction.nextMonthKWh =
          monthlyUsage.toFixed(2)

        updatedPrediction.estimatedMonthlyBill =
          (monthlyUsage * 6).toFixed(2)
      }

      setPrediction(updatedPrediction)

    } catch (err) {
      console.error("Prediction error:", err)
    }

    setLoading(false)
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

        <h2 className="premium-report-header">
          ✇ Fan Usage Prediction Tool
        </h2>

        <div className="details-layout">

          {/* LEFT PANEL */}
          <div className="details-card">

            <h4>Select Date for Prediction</h4>

            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={new Date()}
            />

            <div className="premium-select-wrapper" style={{ marginTop: 20 }}>

              <select
                className="premium-select-modern"
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
              >
                <option value="">-- Select a Fan Device --</option>

                {devices.map(device => (
                  <option key={device._id} value={device._id}>
  {device.company}
</option>
                ))}

              </select>

              <span className="select-glow"></span>

            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="details-card">

            <h4>
              Prediction for {selectedDeviceName || "-- Select a Fan Device --"}
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
              onClick={fetchPrediction}
            >
              Fetch Predictions
            </button>

            {prediction && (

              <div className="prediction-result">

                {viewType === "single" && (
                  <>
                    <h4>⏻ Predicted ON Time:</h4>
                    <p>{new Date(prediction.predictedNextOnTime).toLocaleString()}</p>

                    <h4>⏻ Predicted OFF Time:</h4>
                    <p>{new Date(prediction.predictedNextOffTime).toLocaleString()}</p>

                    <h4>⚡ Estimated Usage:</h4>
                    <p>{prediction.nextDayKWh} kWh</p>
                  </>
                )}

                {viewType === "week" && (
                  <>
                    <h4>📊 Next Week Usage:</h4>
                    <p>{prediction.nextWeekKWh} kWh</p>

                    <h4>💰 Estimated Weekly Bill:</h4>
                    <p>₹ {prediction.estimatedWeeklyBill}</p>
                  </>
                )}

                {viewType === "month" && (
                  <>
                    <h4>📅 Next Month Usage:</h4>
                    <p>{prediction.nextMonthKWh} kWh</p>

                    <h4>💰 Estimated Monthly Bill:</h4>
                    <p>₹ {prediction.estimatedMonthlyBill}</p>
                  </>
                )}

              </div>

            )}

            <p style={{ marginTop: 15, opacity: 0.7 }}>
              Select a date and view type, then click 'Fetch Predictions'.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}