import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function AdminFeedback() {

  const navigate = useNavigate()
  const [feedback,setFeedback] = useState([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    fetch("http://localhost:5000/api/feedback")
    .then(res=>res.json())
    .then(data=>{
      setFeedback(data)
      setLoading(false)
    })
    .catch(()=>setLoading(false))

  },[])

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
          <li onClick={()=>navigate("/admin/update-log")}>Update Log</li>
          <li className="active">User Feedback</li>
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
          <h2>Reported System Issues</h2>
        </div>


        <div className="feedback-grid">

          {loading && <p>Loading feedback...</p>}

          {!loading && feedback.length === 0 && (
            <p>No issues reported</p>
          )}

          {feedback.map(item=>{

            return(

              <div className="feedback-card-premium" key={item._id}>

                <div className="feedback-header">

                  <div className="feedback-avatar">
                    ⚠
                  </div>

                  <div>

                    <h4>{item.message}</h4>

                    <span className="feedback-time">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>

                  </div>

                </div>

                <div className="feedback-status">

               

                </div>

              </div>

            )

          })}

        </div>

      </div>

    </div>

  )

}