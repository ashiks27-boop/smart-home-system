import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import "./Auth.css"

export default function WeatherPrediction() {

  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewType, setViewType] = useState("single")
  const [mode, setMode] = useState("historical")

  const [prediction, setPrediction] = useState(null)
  const [liveWeather, setLiveWeather] = useState(null)

  const [loading, setLoading] = useState(false)
  const [loadingLive, setLoadingLive] = useState(false)

  /* ================= HISTORICAL WEATHER ================= */

  const fetchPrediction = async () => {

    setLoading(true)

    const dates = []
    const baseDate = new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1))

    let days = 1

    if(viewType === "week") days = 7
    if(viewType === "month") days = 30

    for(let i=0;i<days;i++){

      const d = new Date(baseDate)
      d.setDate(baseDate.getDate()+i)

      dates.push(d.toISOString().split("T")[0])

    }

    try {

      const res = await fetch("http://localhost:5000/api/weather/predict",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          dates:dates
        })
      })

      const data = await res.json()

      setPrediction(data)

    } catch(err){
      console.log(err)
    }

    setLoading(false)

  }

  /* ================= LIVE WEATHER ================= */

  const fetchLiveWeather = async () => {

    const date =  new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1))

    setLoadingLive(true)

    try{

      const res = await fetch("http://localhost:5000/api/openmeteo/predict",{

        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          date:date,
          viewType:viewType
        })

      })

      const data = await res.json()

      setLiveWeather(data)

    }catch(err){

      console.log(err)

    }

    setLoadingLive(false)

  }

  return (

    <div className="dashboard-dark">

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

      {/* MAIN */}

      <div className="dark-main">

        {/* TOP BUTTONS */}

        <div style={{marginBottom:"25px"}}>

          <button
            className="premium-btn"
            onClick={()=>setMode("historical")}
          >
            Historical Weather Prediction
          </button>

          <button
            className="premium-btn"
            style={{marginLeft:"10px"}}
            onClick={()=>setMode("live")}
          >
            Live Weather by Open-Meteo
          </button>

        </div>

        {/* ================= HISTORICAL ================= */}

        {mode==="historical" && (

        <>

        <h2 style={{marginBottom:"20px"}}>
        🌡 Weather Prediction (Historical Dataset)
        </h2>

        <div className="details-layout">

          {/* LEFT CARD */}

          <div className="details-card">

            <h4>Select Date for Prediction</h4>

            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
            />

            <div style={{marginTop:"20px"}}>

              <h4>Select View Type</h4>

              <select
                className="premium-select-modern"
                value={viewType}
                onChange={(e)=>setViewType(e.target.value)}
              >
                <option value="single">Single Day</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>

            </div>

          </div>

          {/* RIGHT CARD */}

          <div className="details-card">

            <h4>Predicted Weather & Thermostat Settings</h4>

            <button
              className="premium-btn"
              style={{marginTop:"15px"}}
              onClick={fetchPrediction}
            >
              {loading
                ? "Predicting..."
                : `Fetch Predictions`
              }
            </button>

            {prediction && (

              <div style={{marginTop:"20px"}}>

                <h3>Prediction Results</h3>

                {prediction.map((item,index)=>(

                  <div
                    key={index}
                    style={{
                      marginTop:"10px",
                      padding:"12px",
                      borderRadius:"10px",
                      background:"#1c2b3a"
                    }}
                  >

                    <p><b>Date:</b> {item.date}</p>

                    <p>
                    🌡 Temperature :
                    <b> {item.predicted_temperature} °C</b>
                    </p>

                    <p>
                    🌧 Rainfall :
                    <b> {item.predicted_rainfall} mm</b>
                    </p>

                    <p>
                    ❄ Eco Mode AC :
                    <b> {item.eco_mode_degree} °C</b>
                    </p>

                    <p>
                    🏠 Comfort Mode AC :
                    <b> {item.comfort_mode_degree} °C</b>
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

        </>

        )}

        {/* ================= LIVE WEATHER ================= */}

        {mode==="live" && (

        <>

        <h2 style={{marginBottom:"20px"}}>
        🌥 Live Weather Insights
        </h2>

        <div className="details-layout">

          {/* LEFT CARD */}

          <div className="details-card">

            <h4>Select Date for Live Prediction</h4>

            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
            />

            <div style={{marginTop:"20px"}}>

              <h4>Select View Type</h4>

              <select
                className="premium-select-modern"
                value={viewType}
                onChange={(e)=>setViewType(e.target.value)}
              >
                <option value="single">Single Day</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>

            </div>

          </div>

          {/* RIGHT CARD */}

          <div className="details-card">

            <button
              className="premium-btn"
              style={{marginTop:"10px"}}
              onClick={fetchLiveWeather}
            >
              {loadingLive ? "Loading..." : "Fetch Live Predictions"}
            </button>

            {liveWeather && (

              <div style={{marginTop:"20px"}}>

                <h3>Live Weather Results</h3>

                {liveWeather.map((item,index)=>(

                  <div
                    key={index}
                    style={{
                      marginTop:"10px",
                      padding:"12px",
                      borderRadius:"10px",
                      background:"#1c2b3a"
                    }}
                  >

                    <p><b>Date:</b> {item.date}</p>

                    <p>
                    🌡 Temperature :
                    <b> {item.avg_temp} °C</b>
                    </p>

                    <p>
                    🌧 Rainfall :
                    <b> {item.rainfall} mm</b>
                    </p>

                    <p>
                    💨 Wind Speed :
                    <b> {item.wind_speed} km/h</b>
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

        </>

        )}

      </div>

    </div>

  )

}