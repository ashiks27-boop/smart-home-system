import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function ResidentUpdateLog(){

const navigate = useNavigate()

const [updates,setUpdates] = useState([])
const [loading,setLoading] = useState(true)

useEffect(()=>{

fetch("http://localhost:5000/api/updates")
.then(res=>res.json())
.then(data=>{
setUpdates(data)
setLoading(false)
})
.catch(()=>setLoading(false))

},[])


const getIcon=(type)=>{

if(type==="Security") return "🛡"
if(type==="Maintenance") return "🛠"
return "⚡"

}


return(

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
<li onClick={()=>navigate("/resident")}>Home</li>
<li onClick={()=>navigate("/devices")}>Devices</li>
<li onClick={()=>navigate("/locations")}>Locations</li>
<li onClick={()=>navigate("/device-details")}>Device Details</li>
<li onClick={()=>navigate("/reports")}>Reports</li>
<li onClick={()=>navigate("/predictive")}>Predictive Report</li>
<li onClick={()=>navigate("/resident/feedback")}>Feedback</li>
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
<div className="dashboard-main">

<div className="premium-header">
<h2>  System Updates</h2>
</div>


<div className="update-feed">

{loading && <p>Loading updates...</p>}

{!loading && updates.map(item=>(

<div className="update-card-pro" key={item._id}>

<div className="update-icon-box">
{getIcon(item.type)}
</div>

<div className="update-content">

<div className="update-top">

<span className={`update-badge ${item.type.toLowerCase()}`}>
{item.type}
</span>

<span className="update-time">
{new Date(item.createdAt).toLocaleString()}
</span>

</div>

<p className="update-message">
{item.message}
</p>

</div>

</div>

))}

</div>

</div>

</div>

)

}