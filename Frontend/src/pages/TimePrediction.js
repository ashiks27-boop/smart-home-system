import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import "./Auth.css"

export default function TimePrediction() {

  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState("")
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

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

  /* FETCH TIME PREDICTION */
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

      const selected = new Date(selectedDate)
      const avgUsageMinutes = data.averageUsageMinutes

      const updatedPrediction = {
        predictedNextOnTime: selected,
        predictedNextOffTime: new Date(
          selected.getTime() + (avgUsageMinutes * 60 * 1000)
        )
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
          ⏱ Device Time Prediction Tool
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

            <div style={{ marginTop: 20 }}>

              <h4>Select Device</h4>

              <div className="premium-select-wrapper">

                <select
                  className="premium-select-modern"
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                >

                  <option value="">-- Select a Device --</option>

                  {devices.map(device => (
                    <option key={device._id} value={device._id}>
                      {device.company} ({device.name})
                    </option>
                  ))}

                </select>

                <span className="select-glow"></span>

              </div>

            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="details-card">

            <h4>
              Prediction for {selectedDeviceName || "-- Select a Device --"}
            </h4>

            <button
              className="premium-btn"
              style={{ marginTop: 15 }}
              onClick={fetchPrediction}
            >
              Fetch Time Prediction for {selectedDate.toLocaleDateString()}
            </button>

            {prediction && (

              <div className="prediction-result">

                <h4>⏻ Predicted ON Time:</h4>
                <p>
                  {new Date(prediction.predictedNextOnTime).toLocaleString()}
                </p>

                <h4>⏻ Predicted OFF Time:</h4>
                <p>
                  {new Date(prediction.predictedNextOffTime).toLocaleString()}
                </p>

              </div>

            )}

            <p style={{ marginTop: 15, opacity: 0.7 }}>
              Select a date and device, then click 'Fetch Time Prediction'.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}