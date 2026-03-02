import { useState, useRef, useEffect } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", ""])
  const inputs = useRef([])
  const navigate = useNavigate()

  // 🔐 Protect OTP page (cannot access directly)
  useEffect(() => {
    const allowed = localStorage.getItem("otpAllowed")
    if (!allowed) {
      navigate("/")
    }
  }, [navigate])

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 3) {
      inputs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus()
    }
  }

  const handleVerify = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const finalOtp = otp.join("")

      if (!finalOtp || finalOtp.length < 4) {
        alert("Please enter full OTP")
        return
      }

      const res = await API.post("/otp", {
        otp: finalOtp,
        userId
      })

      const role = res.data.role?.toLowerCase()

      // Save user name for dashboard display
      localStorage.setItem("userName", res.data.name)

      // Lock OTP page again
      localStorage.removeItem("otpAllowed")

      if (role === "admin") {
        navigate("/admin")
      } else if (role === "resident") {
        navigate("/resident")
      } else {
        alert("Invalid role received from server")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP")
    }
  }

  return (
    <div className="premium-login-container">

    {/* LEFT HERO SIDE (Same Theme as Login) */}
    <div className="premium-hero">
      <div className="hero-glow"></div>

      <div className="hero-content">
        <h1 className="hero-title">SMART HOME</h1>

        <p className="hero-tagline">
          Secure authentication system protecting your smart home ecosystem.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            🔐 <span>Multi-layer Security</span>
          </div>

          <div className="feature-card">
            📡 <span>Encrypted Communication</span>
          </div>

          <div className="feature-card">
            🧠 <span>Smart Identity Verification</span>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT OTP CARD */}
    <div className="premium-login-card">

      <div className="login-header">
        <h2>OTP Verification</h2>
        <p>Enter the 4-digit code sent to your phone</p>
      </div>

      <div className="otp-inputs premium-otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>

      <button className="premium-login-btn" onClick={handleVerify}>
        Verify OTP
      </button>

      <div className="secure-text">
        Didn’t receive code? <span className="resend">Resend</span>
      </div>

    </div>
  </div>
  )
}   