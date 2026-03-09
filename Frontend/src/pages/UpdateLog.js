import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function UpdateLog() {

  const navigate = useNavigate()

  const [message,setMessage] = useState("")
  const [type,setType] = useState("System")
  const [loading,setLoading] = useState(true)
  const [updates,setUpdates] = useState([])

  useEffect(()=>{

    fetch("http://localhost:5000/api/updates")
    .then(res=>res.json())
    .then(data=>{
      setUpdates(data)
      setLoading(false)
    })
    .catch(()=>setLoading(false))

  },[])


  const handleSubmit = async()=>{

    if(!message.trim()) return

    await fetch("http://localhost:5000/api/updates",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({message,type})
    })

    setMessage("")
    window.location.reload()

  }


  const getIcon = (type)=>{

    if(type==="Security") return "🛡"
    if(type==="Maintenance") return "🛠"
    return "⚡"

  }


  return(

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
          <li onClick={()=>navigate("/admin")}>Dashboard</li>
          <li className="active">Update Log</li>
          <li onClick={()=>navigate("/admin/feedback")}>User Feedback</li>
        </ul>

        <button
        className="premium-logout-btn"
        onClick={()=>{
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
          <h2>System Updates</h2>
        </div>


        {/* ADD UPDATE CARD */}
        <div className="update-premium-card">

          <h4> Add System Update</h4>

          <input
          type="text"
          placeholder="Enter update message..."
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          className="premium-input"
          />

          <select
          value={type}
          onChange={(e)=>setType(e.target.value)}
          className="premium-select"
          >
            <option>System</option>
            <option>Security</option>
            <option>Maintenance</option>
          </select>

          <button
          className="premium-submit-btn"
          onClick={handleSubmit}
          >
          Submit Update
          </button>

        </div>



        {/* UPDATE LIST */}
        <div className="update-timeline">

          {loading && <p>Loading updates...</p>}

          {!loading && updates.map((item)=>{

            return(

              <div className="update-timeline-card" key={item._id}>

                <div className="update-icon">
                  {getIcon(item.type)}
                </div>

                <div className="update-content">

                  <div className="update-header">

                    <span className={`update-type-badge ${item.type.toLowerCase()}`}>
                      {item.type}
                    </span>

                    <span className="update-time">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>

                  </div>

                  <p className="update-text">
                    {item.message}
                  </p>

                </div>

              </div>

            )

          })}

        </div>

      </div>

    </div>

  )

}