import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";

const API_URL = "http://localhost:5000/api/devices";

export default function ResidentLocations() {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Resident";

  const [devices, setDevices] = useState([]);

  /* ✅ RECEIVE ROOM FROM DASHBOARD */
  const [selectedRoom, setSelectedRoom] = useState(
    location.state?.selectedRoom || "ALL"
  );

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    const fetchDevices = async () => {
      try {
        const res = await fetch(`${API_URL}/${userId}`);
        const data = await res.json();
        setDevices(data || []);
      } catch {
        alert("Failed to load devices");
      }
    };

    fetchDevices();
  }, [userId, navigate]);

  /* GROUP DEVICES */
  const grouped = devices.reduce((acc, d) => {
    const room = d.location || "Unknown";
    if (!acc[room]) acc[room] = [];
    acc[room].push(d);
    return acc;
  }, {});

  const rooms = Object.keys(grouped);

  const displayRooms =
    selectedRoom === "ALL"
      ? grouped
      : { [selectedRoom]: grouped[selectedRoom] || [] };

  const getIcon = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("ac")) return "❄️";
    if (n.includes("light")) return "💡";
    if (n.includes("fan")) return "🌀";
    if (n.includes("door")) return "🚪";
    return "🔌";
  };

  return (
    <div className="dashboard-layout">

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
          <li onClick={() => navigate("/devices")}>Devices</li>
          <li
            className={location.pathname === "/reports" ? "active" : ""}
            onClick={() => navigate("/reports")}
          >
            Reports
          </li>
        
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

        <div className="locations-header premium-header">
          <h2>Smart Home Device Locations</h2>

          <div className="room-selector premium-select">
            <span>Filter Room</span>
            <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
              <option value="ALL">All Rooms</option>
              {rooms.map((room) => (
                <option key={room}>{room}</option>
              ))}
            </select>
          </div>
        </div>

        {devices.length === 0 && (
          <div className="empty-state premium-empty">
            <div className="empty-icon">🏠</div>
            <p>No smart devices connected yet</p>
          </div>
        )}

        <div className="device-grid">
          {Object.entries(displayRooms).map(([room, list]) => (
            <div key={room} className="device-panel premium-room">

              <div className="room-title">
                {room}
                <span className="room-count">{list.length}</span>
              </div>

              {list.map((device) => (
                <div
                  key={device._id}
                  className={`device-card premium-device ${device.status === "ON" ? "is-on" : "is-off"}`}
                  onClick={() => {
                    localStorage.setItem("selectedDeviceId", device._id);
                    navigate("/device-details");
                  }}
                >
                  <div className="premium-icon">{getIcon(device.name)}</div>

                  <div className="premium-info">
                    <h4 className="company">{device.company || "Unknown"}</h4>

                    <div className="device-type">{device.name}</div>

                    <div className="premium-meta">
                      <span className={`status-pill ${device.status.toLowerCase()}`}>
                        {device.status}
                      </span>

                      <span className="usage">
                        ⏱ {Math.floor((device.totalOn || 0) / 60)} min
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}