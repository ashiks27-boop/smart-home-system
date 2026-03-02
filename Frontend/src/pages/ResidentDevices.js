import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const API_URL = "http://localhost:5000/api/devices";

export default function ResidentDevices() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Resident";

  const [devices, setDevices] = useState([]);
  const [paired, setPaired] = useState([]);

  const [showPair, setShowPair] = useState(false);
  const [showConnect, setShowConnect] = useState(false);

  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("Light");

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [room, setRoom] = useState("Room1");

  useEffect(() => {
    if (!userId) navigate("/");
  }, [userId, navigate]);

  const fetchDevices = async () => {
    try {
      const res = await fetch(`${API_URL}/${userId}`);
      const data = await res.json();
      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userId) fetchDevices();
  }, [userId]);

  const deleteDevice = async (id) => {
    if (!window.confirm("Remove this device?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setDevices((prev) => prev.filter((d) => d._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const toggleDevice = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/toggle/${id}`, { method: "PUT" });
      const data = await res.json();
      setDevices((prev) =>
        prev.map((d) => (d._id === id ? data.device : d))
      );
    } catch {
      alert("Toggle failed");
    }
  };

  const pairDevice = () => {
    if (!deviceName) return alert("Enter company name");
    setPaired((prev) => [...prev, { name: deviceName, type: deviceType }]);
    setDeviceName("");
    setShowPair(false);
  };

  const connectDevice = async () => {
    if (!selectedDevice) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: selectedDevice.type,
          company: selectedDevice.name,
          location: room
        })
      });

      const saved = await res.json();
      setDevices((prev) => [...prev, saved]);
      setPaired((prev) => prev.filter((p) => p !== selectedDevice));
      setShowConnect(false);
    } catch {
      alert("Failed to connect device");
    }
  };

  const getIcon = (type) => {
    if (type === "Light") return "💡";
    if (type === "Fan") return "🌀";
    if (type === "Thermostat") return "🌡️";
    if (type === "AC") return "❄️";
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
          <li className="active">Devices</li>
          <li onClick={() => navigate("/reports")}>Reports</li>
         
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
          <h2>Pair New Device</h2>
          <button className="premium-btn" onClick={() => setShowPair(true)}>
            Pair Device
          </button>
        </div>

        <h3 className="section-title">🔗 Available Paired Devices</h3>

        {paired.length === 0 && <p>No paired devices yet</p>}

        {paired.map((d, i) => (
          <div key={i} className="available-card">
            <div>{d.name} <small>({d.type})</small></div>

            <button
              className="premium-btn small"
              onClick={() => {
                setSelectedDevice(d);
                setShowConnect(true);
              }}
            >
              Connect
            </button>
          </div>
        ))}

        <h3 className="section-title">Connected Devices</h3>

        <div className="device-grid">
          {devices.map((d) => (
            <div
              key={d._id}
              className="device-card pro-card"
              onClick={(e) => {
                if (e.target.closest(".device-power-btn")) return;
                navigate("/device-details", { state: { deviceId: d._id } });
              }}
            >
              <button
                className="pro-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDevice(d._id);
                }}
              >
                🗑
              </button>

              <div className="pro-icon-box">{getIcon(d.name)}</div>

              <div className="pro-content">
                <h3 className="pro-company">{d.company || "Unknown"}</h3>

                <div className="pro-meta">
                  <span>{d.name}</span>
                  <span>📍 {d.location}</span>
                </div>

                <button
                  className={`device-power-btn ${d.status === "ON" ? "on" : "off"}`}
                  onClick={(e) => toggleDevice(e, d._id)}
                >
                  {d.status}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS unchanged */}
      {showPair && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Pair Device</h3>
            <input
              placeholder="Company Name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
            <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
              <option>Light</option>
              <option>Fan</option>
              <option>Thermostat</option>
            </select>
            <button className="premium-btn" onClick={pairDevice}>Pair Device</button>
            <button className="cancel-btn" onClick={() => setShowPair(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showConnect && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Connect "{selectedDevice?.name}"</h3>
            <select value={room} onChange={(e) => setRoom(e.target.value)}>
              <option>Room 1</option>
              <option>Living Room</option>
              <option>Room 2</option>
            </select>
            <button className="premium-btn" onClick={connectDevice}>Connect Device</button>
            <button className="cancel-btn" onClick={() => setShowConnect(false)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
}