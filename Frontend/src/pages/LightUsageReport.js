import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Calendar from "react-calendar"
import Chart from "react-apexcharts"
import "react-calendar/dist/Calendar.css"
import "./Auth.css"

export default function LightUsageReport() {

  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [range, setRange] = useState("today")
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState("")
  const [usageData, setUsageData] = useState([])
  const [events, setEvents] = useState([])

  // Fetch Devices
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) return

    axios.get(`http://localhost:5000/api/devices/${userId}`)
      .then(res => {

        const lightDevices = res.data.filter(device =>
          device.type === "Light" ||
          device.name.toLowerCase().includes("light")
        )

        setDevices(lightDevices)

        if (lightDevices.length > 0) {
          setSelectedDevice(lightDevices[0]._id)
        }
      })
  }, [])

  // Fetch & Filter Energy Data
  useEffect(() => {
    if (!selectedDevice) return

    axios.get(`http://localhost:5000/api/energy/${selectedDevice}`)
      .then(res => {

        const allEvents = res.data.events || []
        const now = new Date()
        let filteredEvents = []

        if (range === "today") {
          filteredEvents = allEvents.filter(event => {
            const eventDate = new Date(event.startTime)
            return eventDate.toDateString() === now.toDateString()
          })
        }

        else if (range === "week") {
          const lastWeek = new Date()
          lastWeek.setDate(now.getDate() - 7)

          filteredEvents = allEvents.filter(event => {
            const eventDate = new Date(event.startTime)
            return eventDate >= lastWeek
          })
        }

        // ✅ FIXED LAST MONTH (Previous Calendar Month Only)
        else if (range === "month") {

          const currentMonth = now.getMonth()
          const currentYear = now.getFullYear()

          let previousMonth = currentMonth - 1
          let year = currentYear

          if (previousMonth < 0) {
            previousMonth = 11
            year = currentYear - 1
          }

          const startDate = new Date(year, previousMonth, 1)
          const endDate = new Date(year, previousMonth + 1, 0)
          endDate.setHours(23,59,59,999)

          filteredEvents = allEvents.filter(event => {
            const eventDate = new Date(event.startTime)
            return eventDate >= startDate && eventDate <= endDate
          })
        }

        else if (range === "custom") {
          filteredEvents = allEvents.filter(event => {
            const eventDate = new Date(event.startTime)
            return eventDate.toDateString() === selectedDate.toDateString()
          })
        }

        // Group for chart
        const grouped = {}

        filteredEvents.forEach(event => {
          const date = new Date(event.startTime).toLocaleDateString()
          if (!grouped[date]) grouped[date] = 0
          grouped[date] += Number(event.kWh)
        })

        const chartData = Object.keys(grouped).map(date => ({
          date,
          kWh: grouped[date]
        }))

        setUsageData(chartData)
        setEvents(filteredEvents)
      })
  }, [selectedDevice, range, selectedDate])

  const totalEnergy = usageData.reduce(
    (sum, item) => sum + Number(item.kWh),
    0
  )

  const chartOptions = {
    series: [
      {
        name: "Total Usage",
        data: usageData.map(d => Number(d.kWh))
      }
    ],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      theme: { mode: "dark" },
      xaxis: {
        categories: usageData.map(d => d.date)
      }
    }
  }

  return (
    <div className="energy-layout">

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
<div className="report-header premium-report-header">

  <div className="report-title-section">
    <div className="report-icon">💡</div>
    <div>
      <h2 className="report-title"> Light Usage Report</h2>
      <p className="report-subtitle">
       
      </p>
    </div>
  </div>

  <div className="range-buttons premium-range-buttons">
    <button
      className={range === "today" ? "range-btn active-range" : "range-btn"}
      onClick={() => setRange("today")}
    >
      Today
    </button>

    <button
      className={range === "week" ? "range-btn active-range" : "range-btn"}
      onClick={() => setRange("week")}
    >
      Last Week
    </button>

    <button
      className={range === "month" ? "range-btn active-range" : "range-btn"}
      onClick={() => setRange("month")}
    >
      Last Month
    </button>
  </div>

</div>

        <div className="light-layout">

          <div className="light-sidebar">
            <h4>Select Date</h4>
            <Calendar
              onChange={(date) => {
                setRange("custom")
                setSelectedDate(date)
              }}
              value={selectedDate}
            />

            <h4>Select Light Device</h4>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
            >
              {devices.map(device => (
                <option key={device._id} value={device._id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>

          <div className="light-main">

            <div className="glass-card">
              <h4>Daily Usage Summary</h4>
              <Chart
                options={chartOptions.options}
                series={chartOptions.series}
                type="bar"
                height={300}
              />
            </div>

            <div className="glass-card mt-4">
              <h4>Individual Usage Events</h4>

              {events.length === 0 ? (
                <p>No event data for selected period.</p>
              ) : (
                <table className="energy-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>kWh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event, index) => (
                      <tr key={index}>
                        <td>{event.status}</td>
                        <td>{new Date(event.startTime).toLocaleString()}</td>
                        <td>{new Date(event.endTime).toLocaleString()}</td>
                        <td>{event.kWh}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}