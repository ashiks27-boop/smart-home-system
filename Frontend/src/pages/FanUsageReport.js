import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Calendar from "react-calendar"
import Chart from "react-apexcharts"
import "react-calendar/dist/Calendar.css"
import "./Auth.css"

const FAN_POWER = 0.075 // 75W average fan (0.075 kW)

export default function FanUsageReport() {

  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [range, setRange] = useState("today")

  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState("")
  const [usageData, setUsageData] = useState([])
  const [events, setEvents] = useState([])

  /* ================= FETCH FAN DEVICES ================= */
  useEffect(() => {

    const userId = localStorage.getItem("userId")
    if (!userId) return

    axios.get(`http://localhost:5000/api/devices/${userId}`)
      .then(res => {

        const fanDevices = res.data.filter(device =>
          device.name.toLowerCase().includes("fan")
        )

        setDevices(fanDevices)

        if (fanDevices.length > 0) {
          setSelectedDevice(fanDevices[0]._id)
        }
      })

  }, [])

  /* ================= FETCH HISTORY ================= */
  useEffect(() => {

    if (!selectedDevice) return

    axios.get(`http://localhost:5000/api/devices/history/${selectedDevice}`)
      .then(res => {

        const allEvents = res.data || []
        const now = new Date()

        let startDate
        let endDate

        // ===== TODAY =====
        if (range === "today") {
          startDate = new Date()
          startDate.setHours(0,0,0,0)

          endDate = new Date()
          endDate.setHours(23,59,59,999)
        }

        // ===== LAST WEEK =====
        else if (range === "week") {
          startDate = new Date()
          startDate.setDate(now.getDate() - 7)
          startDate.setHours(0,0,0,0)

          endDate = new Date()
          endDate.setHours(23,59,59,999)
        }

        // ===== LAST MONTH (Previous Calendar Month) =====
        else if (range === "month") {

          const currentMonth = now.getMonth()
          const currentYear = now.getFullYear()

          let previousMonth = currentMonth - 1
          let year = currentYear

          if (previousMonth < 0) {
            previousMonth = 11
            year = currentYear - 1
          }

          startDate = new Date(year, previousMonth, 1)
          endDate = new Date(year, previousMonth + 1, 0)

          startDate.setHours(0,0,0,0)
          endDate.setHours(23,59,59,999)
        }

        // ===== CUSTOM DATE =====
        else if (range === "custom") {
          startDate = new Date(selectedDate)
          startDate.setHours(0,0,0,0)

          endDate = new Date(selectedDate)
          endDate.setHours(23,59,59,999)
        }

        const filteredEvents = allEvents.filter(event => {
          const eventDate = new Date(event.startTime)
          return eventDate >= startDate && eventDate <= endDate
        })

        // GROUP FOR CHART
        const grouped = {}

        filteredEvents.forEach(event => {
          const date = new Date(event.startTime).toLocaleDateString()

          if (!grouped[date]) grouped[date] = 0
          grouped[date] += event.durationSeconds || 0
        })

        const chartData = Object.keys(grouped).map(date => {
          const hours = grouped[date] / 3600
          return {
            date,
            kWh: +(hours * FAN_POWER).toFixed(3)
          }
        })

        setUsageData(chartData)
        setEvents(filteredEvents)

      })
      .catch(() => {
        setUsageData([])
        setEvents([])
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
      <div className="sidebar">
        <div className="smart-home-logo">
          <div className="smart-icon">💎</div>
          <div className="smart-text">
            <span>Smart</span>
            <span>Home</span>
          </div>
        </div>

        <ul>
          <li onClick={() => navigate("/resident")}>Home</li>
          <li className="active" onClick={() => navigate("/reports")}>Reports</li>
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
      <div className="dashboard-main">

       <div className="report-header premium-report-header">

  <div className="report-title-section">
    <div className="report-icon"></div>
    <div>
      <h2 className="report-title">Fan Usage Analytics</h2>
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

          {/* LEFT PANEL */}
          <div className="light-sidebar">
            <h4>Select Date</h4>
            <Calendar
              onChange={(date) => {
                setRange("custom")
                setSelectedDate(date)
              }}
              value={selectedDate}
            />

            <h4 style={{ marginTop: 20 }}>Select Fan Device</h4>
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

          {/* RIGHT PANEL */}
          <div className="light-main">

            <div className="glass-card">
              <h4>Daily Usage Summary</h4>
              <Chart
                options={chartOptions.options}
                series={chartOptions.series}
                type="bar"
                height={300}
              />
              <div style={{ marginTop: 20 }}>
                <strong>Total Energy:</strong> {totalEnergy.toFixed(3)} kWh
              </div>
            </div>

            <div className="glass-card mt-4">
              <h4>Individual Usage Events</h4>

              {events.length === 0 ? (
                <p>No event data for selected period.</p>
              ) : (
                <table className="energy-table">
                  <thead>
                    <tr>
                      <th>Start</th>
                      <th>End</th>
                      <th>Duration (min)</th>
                      <th>kWh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event, index) => {
                      const hours = event.durationSeconds / 3600
                      return (
                        <tr key={index}>
                          <td>{new Date(event.startTime).toLocaleString()}</td>
                          <td>{new Date(event.endTime).toLocaleString()}</td>
                          <td>{(event.durationSeconds / 60).toFixed(2)}</td>
                          <td>{(hours * FAN_POWER).toFixed(3)}</td>
                        </tr>
                      )
                    })}
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