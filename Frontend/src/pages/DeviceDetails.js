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

  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [ecoTemp, setEcoTemp] = useState(24);
  const [comfortTemp, setComfortTemp] = useState(22);

  const [onHour, setOnHour] = useState("00");
const [onMinute, setOnMinute] = useState("00");

const [offHour, setOffHour] = useState("00");
const [offMinute, setOffMinute] = useState("00");

  /* ⭐ AUTOMATION STATES */
  const [onTime, setOnTime] = useState("");
  const [offTime, setOffTime] = useState("");

  /* WEATHER */
  useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Kochi&units=metric&appid=26f91944c05379b0585f37cb2cb61263"
    )
      .then((res) => res.json())
      .then((data) => data?.main && setWeather(data));
  }, []);

  /* FETCH AI TEMPERATURE */
  useEffect(() => {

    const fetchPrediction = async () => {

      const today = new Date().toISOString().split("T")[0];

      try {

        const res = await fetch(
          "http://localhost:5000/api/weather/predict",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dates: [today]
            })
          }
        );

        const data = await res.json();

        if (data.length > 0) {
          setEcoTemp(data[0].eco_mode_degree);
          setComfortTemp(data[0].comfort_mode_degree);
        }

      } catch (err) {
        console.log(err);
      }

    };

    fetchPrediction();

  }, []);

  useEffect(() => {

    if (thermoMode === "Eco") {
      setTargetTemp(ecoTemp);
    }

    if (thermoMode === "Comfort") {
      setTargetTemp(comfortTemp);
    }

  }, [thermoMode, ecoTemp, comfortTemp]);

  useEffect(() => {
    if (!userId) navigate("/");
  }, [userId, navigate]);

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

 useEffect(() => {

if (!selected) return;

const fetchHistory = async () => {

const res = await fetch(
`http://localhost:5000/api/devices/history/${selected._id}`
)

const data = await res.json()

const formatted = data.map(h => ({

date:new Date(h.createdAt).toLocaleDateString(),
time:new Date(h.createdAt).toLocaleTimeString(),

usage:Math.max((h.durationSeconds || 0)/60,0.1)

}))

setHistory(formatted)

}

fetchHistory()

}, [selected])

  const handleSelect = (id) => {
    const dev = devices.find((d) => d._id === id);
    setSelectedId(id);
    setSelected(dev);
    setShowChart(false);
  };

const toggle = async () => {

  try {

    const res = await fetch(`${API_URL}/toggle/${selected._id}`, {
      method: "PUT"
    });

    const data = await res.json();

    // update selected device instantly
    setSelected(data.device);

    // update device list
    setDevices(prev =>
      prev.map(d => d._id === data.device._id ? data.device : d)
    );

  } catch (err) {

    console.log("Toggle error", err);

  }

};
  /* ⭐ SAVE AUTOMATION */
  const saveAutomation = async () => {

    if (!onTime || !offTime) {
      alert("Select ON and OFF time");
      return;
    }

    await fetch("http://localhost:5000/api/devices/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        deviceId: selected._id,
        onTime,
        offTime
      })
    });

    alert("Automation Saved");
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
         
          <li onClick={() => navigate("/reports")}>Reports</li>
          <li onClick={() => navigate("/predictive")}>Predictive Report</li>
          <li onClick={() => navigate("/resident/feedback")}>Feedback </li>
          <li onClick={() => navigate("/resident/update-log")}>Updates</li>
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
          <>
            <div className="details-card">
              <div className="action-row">
                <button className="btn green" onClick={toggle}>Start</button>
                <button className="btn red" onClick={toggle}>Stop</button>
                <button className="btn blue" onClick={() => setShowChart(!showChart)}>
                  Usage Chart
                </button>
              </div>
            </div>

            {/* ⭐ AUTOMATION */}
            <div className="details-card premium-automation">

  <div className="automation-header">
    <h3>⚡ Smart Automation</h3>
    <p>Schedule device activity automatically</p>
  </div>

  <div className="automation-grid">

    <div className="automation-field">
      <label>ON Time</label>
      <input
        type="time"
        value={onTime}
        onChange={(e) => setOnTime(e.target.value)}
      />
    </div>

        <div className="automation-field">
          <label>OFF Time</label>
          <input
            type="time"
            value={offTime}
            onChange={(e) => setOffTime(e.target.value)}
          />
        </div>
    
      </div>
    
      <button
        className="premium-automation-btn"
        onClick={saveAutomation}
      >
        ⚙ Save Automation
      </button>
    
    </div>
              </>
            )}

        {/* FAN */}
        {type === "fan" && (
          <>
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

            {/* ⭐ AUTOMATION */}
           <div className="details-card premium-automation">

  <div className="automation-header">
    <h3>⚡ Smart Automation</h3>
    <p>Schedule your device to turn ON and OFF automatically</p>
  </div>

  <div className="automation-grid">

    <div className="automation-field">
      <label>Device ON Time</label>
      <input
        type="time"
        value={onTime}
        onChange={(e) => setOnTime(e.target.value)}
      />
    </div>

    <div className="automation-field">
      <label>Device OFF Time</label>
      <input
        type="time"
        value={offTime}
        onChange={(e) => setOffTime(e.target.value)}
      />
    </div>

  </div>

  <button
    className="premium-automation-btn"
    onClick={saveAutomation}
  >
    ⚙ Save Automation
  </button>

</div>
          </>
        )}

        {/* THERMOSTAT */}
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

            {/* ⭐ AUTOMATION */}
            <div className="details-card premium-automation">

  <div className="automation-header">
    <h3>⚡ Smart Automation</h3>
    <p>Schedule device activity automatically</p>
  </div>

  <div className="automation-grid">

    <div className="automation-field">
      <label>ON Time</label>
      <input
        type="time"
        value={onTime}
        onChange={(e) => setOnTime(e.target.value)}
      />
    </div>

    <div className="automation-field">
      <label>OFF Time</label>
      <input
        type="time"
        value={offTime}
        onChange={(e) => setOffTime(e.target.value)}
      />
    </div>

  </div>

  <button className="premium-automation-btn" onClick={saveAutomation}>
    Save Automation
  </button>

</div>
          </>
        )}

        {showChart && (
          <div className="details-card">
          <ResponsiveContainer width="100%" height={260}>
  <LineChart data={history}>
    
    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

    <XAxis dataKey="date" stroke="#94a3b8" />

    <YAxis stroke="#94a3b8" />

    <Tooltip
      contentStyle={{
        backgroundColor: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "10px",
        color: "#fff"
      }}
      labelStyle={{ color: "#38bdf8" }}
      itemStyle={{ color: "#fff" }}
      formatter={(value) => `${value.toFixed(1)} mins`}
    />

    <Line
      type="monotone"
      dataKey="usage"
      stroke="#38bdf8"
      strokeWidth={3}
      dot={{ r: 4 }}
    />

  </LineChart>
</ResponsiveContainer>

            <p>⏱ Total Usage: {totalUsage.toFixed(1)} mins</p>
          </div>
        )}

      </div>
    </div>
  );
}