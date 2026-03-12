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
      {/* LEFT SECTION - Same as Login Page */}
      <div className="premium-hero">
        <div className="hero-content">
          <div className="hero-logo">
            <h1 className="hero-title">
              <span className="hero-icon">✨</span>
              <br/>SmartHome<span className="hero-dot">.</span>
            </h1>
          </div>

          <p className="hero-tagline">
            Experience the future of living with intelligent automation, 
            real-time insights, and seamless control at your fingertips.
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🔐</span>
              </div>
              <div className="feature-text">
                <h4>Multi-layer Security</h4>
                <p>End-to-end encryption</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📡</span>
              </div>
              <div className="feature-text">
                <h4>Encrypted Communication</h4>
                <p>Secure data transmission</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🧠</span>
              </div>
              <div className="feature-text">
                <h4>Smart Verification</h4>
                <p>AI-powered identity check</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🛡️</span>
              </div>
              <div className="feature-text">
                <h4>2FA Protection</h4>
                <p>Two-factor authentication</p>
              </div>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">Secure</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Protection</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT OTP SECTION - Matching Login Page Design */}
      <div className="premium-login-card">
        <div className="login-card-content">
          {/* Welcome Badge */}
          <div className="welcome-badge">
            <span className="welcome-icon">🔑</span>
            <span>Verification required</span>
          </div>

          {/* Header */}
          <div className="login-header">
            <h2>OTP Verification</h2>
            <p>Enter the 4-digit code sent to your phone</p>
          </div>

          {/* Decorative Line */}
          <div className="decorative-line">
            <span className="line"></span>
            <span className="line-icon"></span>
            <span className="line"></span>
          </div>

          {/* OTP Input Fields - Styled like login inputs */}
          <div className="premium-form">
            <div className="form-field">
              <div className="field-label">
                <span className="label-main">VERIFICATION CODE</span>
                <span className="label-badge">OTP</span>
              </div>
              
              <div className="otp-inputs-container">
                <div className="otp-inputs premium-otp-inputs">
                  {otp.map((digit, index) => (
                    <div key={index} className="otp-input-wrapper">
                      <input
                        ref={(el) => (inputs.current[index] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`premium-otp-input ${digit ? 'filled' : ''}`}
                        inputMode="numeric"
                        pattern="\d*"
                      />
                      {index < 3 && <span className="otp-dash"></span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="field-hint">
                <span className="hint-icon"></span>
                <span>Enter the 4-digit code sent to your registered mobile</span>
              </div>
            </div>

            {/* Verify Button - Same style as login */}
            <button 
              className="premium-login-btn" 
              onClick={handleVerify}
              disabled={otp.join("").length < 4}
            >
              <span className="btn-text">
                VERIFY OTP
                <span className="btn-icon">→</span>
              </span>
            </button>
          </div>

          

          {/* Resend Option */}
          <div className="secure-text">
            <span className="secure-badge">
              <span className="secure-icon">📱</span>
              Didn't receive code? <span className="resend-link">Resend OTP</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}