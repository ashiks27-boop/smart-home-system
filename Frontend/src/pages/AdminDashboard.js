import { Row, Col, Card, Table, Button } from "react-bootstrap"
import Chart from "react-apexcharts"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const adminName = localStorage.getItem("userName") || "Admin"

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  // Chart Config
  const energyChart = {
    series: [
      {
        name: "Energy Usage",
        data: [120, 200, 150, 300, 250, 400, 350]
      }
    ],
    options: {
      chart: { type: "line" },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      stroke: { curve: "smooth" }
    }
  }

  const deviceChart = {
    series: [60, 25, 15],
    options: {
      labels: ["Active", "Inactive", "Error"],
      chart: { type: "pie" }
    }
  }

  return (
    <div className="admin-layout">
      
      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <div className="admin-logo">SmartHome</div>

        <div className="admin-profile">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Admin"
          />
          <h3>{adminName}</h3>
          <p>admin@smarthome.com</p>
        </div>

        <ul>
          <li className="active">📊 Dashboard</li>
          <li>👥 Residents</li>
          <li>📟 Devices</li>
          <li>⚙️ Settings</li>
          
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
      <div className="admin-main">

        {/* HEADER */}
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
          <div className="header-icons">
            <span>🌐</span>
            <span>🔔</span>
            <span>⚙️</span>
          </div>
        </div>

        {/* TOP STATS */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="admin-card">
              <h4>Total Residents</h4>
              <h2>2</h2>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="admin-card">
              <h4>Active Devices</h4>
              <h2>2</h2>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="admin-card">
              <h4>Energy Usage</h4>
              <h2>0kWh</h2>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="admin-card">
              <h4>Alerts</h4>
              <h2>2</h2>
            </Card>
          </Col>
        </Row>

        {/* CHARTS */}
        <Row>
          <Col md={8}>
            <Card className="admin-chart">
              <h5>Weekly Energy Consumption</h5>
              <Chart
                options={energyChart.options}
                series={energyChart.series}
                type="line"
                height={300}
              />
            </Card>
          </Col>

          <Col md={4}>
            <Card className="admin-chart">
              <h5>Device Status</h5>
              <Chart
                options={deviceChart.options}
                series={deviceChart.series}
                type="pie"
                height={300}
              />
            </Card>
          </Col>
        </Row>

        {/* TABLE */}
        <Row className="mt-4">
          <Col>
            <Card className="admin-table">
              <h5>Resident Activity</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ashik</td>
                    <td>8888888888</td>
                    <td>
                      <span className="status booked">Online</span>
                    </td>
                    <td>
                      <Button size="sm">View</Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Rahul</td>
                    <td>7777777777</td>
                    <td>
                      <span className="status offline">Offline</span>
                    </td>
                    <td>
                      <Button size="sm" variant="secondary">
                        View
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>

      </div>
    </div>
  )
}
