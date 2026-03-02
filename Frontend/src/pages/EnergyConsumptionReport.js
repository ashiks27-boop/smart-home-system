import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Chart from "react-apexcharts"
import "./Auth.css"

export default function EnergyConsumptionReport() {

  const navigate = useNavigate()

  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState("")
  const [usageData, setUsageData] = useState([])
  const [events, setEvents] = useState([])
  const [range, setRange] = useState("week")

  /* ✅ Fetch Devices Using userId */
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) return

    axios
      .get(`http://localhost:5000/api/devices/${userId}`)
      .then((res) => {
        setDevices(res.data)

        if (res.data.length > 0) {
          setSelectedDevice(res.data[0]._id.toString())
        }
      })
      .catch((err) => console.error("Device fetch error:", err))
  }, [])

  /* ✅ Fetch Energy Data */
  useEffect(() => {
    if (!selectedDevice) return

    axios.get(
      `http://localhost:5000/api/energy/${selectedDevice}?range=${range}`
    )
      .then((res) => {

        let fetchedEvents = res.data.events || []
        let fetchedChartData = res.data.chartData || []

        // ✅ FIX ONLY LAST MONTH (Previous Calendar Month Only)
        if (range === "month") {

          const now = new Date()
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
          endDate.setHours(23, 59, 59, 999)

          // Filter events
          fetchedEvents = fetchedEvents.filter(event => {
            const eventDate = new Date(event.startTime)
            return eventDate >= startDate && eventDate <= endDate
          })

          // Regroup chart data
          const grouped = {}

          fetchedEvents.forEach(event => {
            const date = new Date(event.startTime).toLocaleDateString()
            if (!grouped[date]) grouped[date] = 0
            grouped[date] += Number(event.kWh)
          })

          fetchedChartData = Object.keys(grouped).map(date => ({
            date,
            kWh: grouped[date]
          }))
        }

        setUsageData(fetchedChartData)
        setEvents(fetchedEvents)

      })
      .catch((err) => {
        console.error("Energy Fetch Error:", err)
        setUsageData([])
        setEvents([])
      })

  }, [selectedDevice, range])

  /* Calculate Total Energy */
  const totalEnergy = usageData.reduce(
    (sum, item) => sum + Number(item.kWh),
    0
  )

  const chartOptions = {
    series: [
      {
        name: "Total kWh",
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

        <h2 className="premium-report-header">
          ⚡ Energy Consumption Report
        </h2>

        <div className="details-layout">

          <div className="energy-sidebar">
            <h4>Select Device</h4>

            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
            >
              {devices.map(device => (
                <option key={device._id} value={device._id.toString()}>
                  {device.name}
                </option>
              ))}
            </select>

            <h4 className="mt-4">Select Display Range</h4>

            <button onClick={() => setRange("day")}>Today</button>
            <button onClick={() => setRange("week")}>Last Week</button>
            <button onClick={() => setRange("month")}>Last Month</button>
          </div>

          <div className="energy-main">

            <div className="energy-summary">
              <div className="glass-card">
                <h5>Total kWh</h5>
                <h2>{totalEnergy.toFixed(4)} kWh</h2>
              </div>

              <div className="glass-card">
                <h5>Total Events</h5>
                <h2>{events.length}</h2>
              </div>
            </div>

            <div className="glass-card mt-4">
              <h5>Daily Energy Consumption Summary</h5>
              <Chart
                options={chartOptions.options}
                series={chartOptions.series}
                type="bar"
                height={300}
              />
            </div>

            <div className="glass-card mt-4">
              <h5>Individual Usage Events</h5>

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

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}