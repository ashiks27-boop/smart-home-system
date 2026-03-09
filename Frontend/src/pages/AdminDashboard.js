import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function AdminDashboard() {

  const navigate = useNavigate()
  const adminName = localStorage.getItem("userName") || "Admin"

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="admin-layout-pro">

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
          <li className="active">Dashboard</li>
          <li onClick={() => navigate("/admin/update-log")}>Update Log</li>
          <li onClick={() => navigate("/admin/feedback")}>User Feedback</li>
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
      <div className="admin-main-pro">

        <div className="locations-header premium-header">
          <div>
            <h2>Admin Dashboard</h2>
            <p>System Overview & Management</p>
          </div>
        </div>


        {/* STAT CARD */}
        <div className="stats-grid">

          <div className="stat-card premium-stat">
            <div className="stat-icon"></div>

            <div>
              <h6>Total Residents</h6>
              <h2>{users.length}</h2>
              <span>Registered Users</span>
            </div>
          </div>

        </div>


        {/* USERS LIST */}
        <div className="user-table-card premium-users">

          <div className="table-header">
            <h4>Registered Residents</h4>
            <span className="table-sub">
              Manage and monitor resident accounts
            </span>
          </div>

          {loading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No residents found.</p>
          ) : (

            <table className="pro-table premium-table">

              <thead>
                <tr>
                  <th>Resident</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {users.map(user => (

                  <tr key={user._id}>

                    <td className="user-cell">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <strong>{user.name}</strong>
                      </div>
                    </td>

                    <td>{user.phone}</td>

                    <td>
                      <span className="status-badge active">
                        ● Active
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  )
}