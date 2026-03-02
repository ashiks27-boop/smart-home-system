import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import "./Auth.css";

const API_URL = "http://localhost:5000/api/devices";

export default function DeviceDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");

  const clickedId =
    location.state?.deviceId || localStorage.getItem("selectedDeviceId");

  const [devices, setDevices] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selected, setSelected] = useState(null);

  const [showChart, setShowChart] = useState(false);
  const [thermoMode, setThermoMode] = useState("Eco");
  const [targetTemp, setTargetTemp] = useState(24);
  const [fanSpeed, setFanSpeed] = useState(3);

  const [history, setHistory] = useState([]);

  /* ⭐ FIXED WEATHER STATE */
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

 
  /* WEATHER */
  useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Kochi&units=metric&appid=26f91944c05379b0585f37cb2cb61263"
    )
      .then((res) => res.json())
      .then((data) => data?.main && setWeather(data));
  }, []);

  useEffect(() => {
    if (!userId) navigate("/");
  }, [userId, navigate]);

  /* FETCH DEVICES */
  useEffect(() => {
    const fetchDevices = async () => {
      const res = await fetch(`${API_URL}/${userId}`);
      const data = await res.json();

      setDevices(data);

      if (clickedId) {
        const found = data.find((d) => d._id === clickedId);
        if (found) {
          setSelected(found);
          setSelectedId(found._id);
          return;
        }
      }

      if (data.length > 0) {
        setSelected(data[0]);
        setSelectedId(data[0]._id);
      }
    };

    if (userId) fetchDevices();
  }, [userId, clickedId]);

  /* HISTORY */
  useEffect(() => {
    if (!selected) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/devices/history/${selected._id}`
        );
        const data = await res.json();

        const formatted = data.map((h) => ({
          time: new Date(h.createdAt).toLocaleTimeString(),
          usage: Math.max((h.durationSeconds || 0) / 60, 0.1),
        }));

        setHistory(formatted);
      } catch {
        setHistory([]);
      }
    };

    fetchHistory();
  }, [selected]);

  const handleSelect = (id) => {
    const dev = devices.find((d) => d._id === id);
    setSelectedId(id);
    setSelected(dev);
    setShowChart(false);
  };

  const toggle = async () => {
    await fetch(`${API_URL}/toggle/${selected._id}`, { method: "PUT" });

    const res = await fetch(`${API_URL}/${userId}`);
    const data = await res.json();

    setDevices(data);
    setSelected(data.find((d) => d._id === selected._id));
  };

  if (!selected) return null;

  const type = selected.name?.toLowerCase();
  const totalUsage = history.reduce((sum, h) => sum + h.usage, 0);

  return (
    <div className="dashboard-layout">
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
        <div className="premium-header">
          <h2 className="premium-title">Device Details</h2>

         <div className="premium-filter">
            <label>Select Device</label>
            <select value={selectedId} onChange={(e) => handleSelect(e.target.value)}>
              {devices.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.company} — {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="details-card">
          <h3>{selected.company}</h3>
          <p><b>Type:</b> {selected.name}</p>
          <p><b>Status:</b> {selected.status}</p>
          <p><b>Room:</b> {selected.location}</p>
        </div>


         {/* LIGHT */}
        {type === "light" && (
          <div className="details-card">
            <div className="action-row">
              <button className="btn green" onClick={toggle}>Start</button>
              <button className="btn red" onClick={toggle}>Stop</button>
              <button className="btn blue" onClick={() => setShowChart(!showChart)}>
                Usage Chart
              </button>
            </div>
          </div>
        )}

          {/* FAN */}
        {type === "fan" && (
          <div className="details-card">
            <h3>Fan Control Panel</h3>

            <div className="action-row">
              <button className="btn green" onClick={toggle}>Turn ON</button>
              <button className="btn red" onClick={toggle}>Turn OFF</button>
            </div>

            <label>Fan Speed: <b>{fanSpeed}</b></label>
            <input type="range" min="1" max="5" value={fanSpeed}
              onChange={(e) => setFanSpeed(e.target.value)} className="fan-slider" />

            <button className="btn blue" onClick={() => setShowChart(!showChart)}>
              Usage Analytics
            </button>
          </div>
        )}

       

        {/* ⭐ THERMOSTAT */}
        {type === "thermostat" && (
          <>
            <div className="details-card weather-pro">
  <div className="weather-row">

    <div>
      <h3 className="weather-city">Kochi</h3>

      <div className="weather-temp">
        {weather?.main?.temp?.toFixed(1) || "--"}°
        <span>C</span>
      </div>

      <p className="weather-desc">
        {weather?.weather?.[0]?.description || "Loading..."}
      </p>

      <div className="weather-stats">
        <span>💧 {weather?.main?.humidity || "--"}%</span>
        <span>💨 {weather?.wind?.speed || "--"} m/s</span>
      </div>
    </div>



  </div>
</div>

            <div className="details-card">
              <h3>Thermostat Control</h3>

              <div className="action-row">
                {["Eco", "Comfort", "Custom"].map((m) => (
                  <label key={m}>
                    <input
                      type="radio"
                      checked={thermoMode === m}
                      onChange={() => setThermoMode(m)}
                    />
                    {m}
                  </label>
                ))}
              </div>

              <input
                className="temp-input"
                type="number"
                value={targetTemp}
                disabled={thermoMode !== "Custom"}
                onChange={(e) => setTargetTemp(e.target.value)}
              />

              <div className="action-row">
                <button className="btn green" onClick={toggle}>Turn ON</button>
                <button className="btn red" onClick={toggle}>Stop</button>
                <button className="btn blue" onClick={() => setShowChart(!showChart)}>
                  Usage
                </button>
              </div>
            </div>
          </>
        )}

        {showChart && (
          <div className="details-card">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="usage" />
              </LineChart>
            </ResponsiveContainer>

            <p>⏱ Total Usage: {totalUsage.toFixed(1)} mins</p>
          </div>
        )}
      </div>
    </div>
  );
}