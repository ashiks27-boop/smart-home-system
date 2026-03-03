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
          <li onClick={() => navigate("/admin/update-log")}> Update Log</li>
          <li onClick={() => navigate("/admin/feedback")}> User Feedback</li>
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

        {/* STAT CARDS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h6>Total Residents</h6>
            <h3>{users.length}</h3>
            <span>Registered Users</span>
          </div>

          
        </div>

        {/* USERS TABLE */}
        <div className="user-table-card">
          <h4>Registered Residents</h4>

          {loading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No residents found.</p>
          ) : (
            <table className="pro-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span className="role-badge">
                        {user.role}
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