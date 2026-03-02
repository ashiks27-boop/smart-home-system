import { Row, Col, Card, Table, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const adminName = localStorage.getItem("userName") || "Admin"

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <div className="admin-dark-layout">

      {/* SIDEBAR */}
      <div className="admin-dark-sidebar">
        <div>
          <div className="admin-dark-logo">💎 Smart Home</div>

          <ul>
            <li className="active" onClick={() => navigate("/admin")}>
              📊 Dashboard
            </li>

            <li onClick={() => navigate("/admin/update-log")}>
              📝 Update Log
            </li>

            <li onClick={() => navigate("/admin/feedback")}>
              💬 User Feedback
            </li>
          </ul>
        </div>

        <button className="admin-dark-logout" onClick={logout}>
          ⏻ Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="admin-dark-main">

        <div className="admin-dark-header">
          <div>
            <h2>Admin Dashboard</h2>
            <p>System Overview & Management</p>
          </div>
          <div className="admin-user">
            👤 {adminName}
          </div>
        </div>

        <Row className="mb-4">
          <Col md={3}>
            <Card className="admin-dark-card">
              <h6>Total Residents</h6>
              <h3>2</h3>
              <span className="label-muted">Registered Users</span>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="admin-dark-card">
              <h6>Total Devices</h6>
              <h3>3</h3>
              <span className="label-muted">Connected Devices</span>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="admin-dark-card">
              <h6>Active Devices</h6>
              <h3 className="text-success">2</h3>
              <span className="label-success">Running Now</span>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="admin-dark-card">
              <h6>System Alerts</h6>
              <h3 className="text-danger">1</h3>
              <span className="label-danger">Needs Attention</span>
            </Card>
          </Col>
        </Row>

      </div>
    </div>
  )
}