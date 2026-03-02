import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      alert("Enter name and phone");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/phone", { phone, name });

      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userName", name);
      localStorage.setItem("otpAllowed", "true");

      navigate("/otp");
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-login-container">

      {/* LEFT HERO SECTION */}
      <div className="premium-hero">
        <div className="hero-glow"></div>

        <div className="hero-content">
          <h1 className="hero-title">SMART HOME</h1>

          <p className="hero-tagline">
            Smart living reimagined. Control lighting, security and automation
            with one intelligent dashboard.
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              <span className="icon">💡</span>
              <div>
                <h4>Smart Lighting</h4>
                <p>Automate brightness & schedules</p>
              </div>
            </div>

            <div className="feature-card">
              <span className="icon">🔐</span>
              <div>
                <h4>Secure Access</h4>
                <p>Advanced authentication system</p>
              </div>
            </div>

            <div className="feature-card">
              <span className="icon">📊</span>
              <div>
                <h4>Energy Reports</h4>
                <p>Real-time usage analytics</p>
              </div>
            </div>

            <div className="feature-card">
              <span className="icon">🌦</span>
              <div>
                <h4>Weather Automation</h4>
                <p>Climate-based automation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN CARD */}
     <div className="premium-login-card">

  <div className="login-header">
    <h2>Welcome Back</h2>
    <p>Login securely using your phone number</p>
  </div>

  <form onSubmit={handleSubmit} className="premium-form">

    <div className="input-wrapper">
      <input
        type="text"
        placeholder=" "
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label>Full Name</label>
    </div>

    <div className="input-wrapper">
      <input
        type="text"
        placeholder=" "
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <label>Phone Number</label>
    </div>

    <button
      type="submit"
      className="premium-login-btn"
    >
      Send OTP
    </button>

  </form>

  <div className="secure-text">
    🔒 OTP verification ensures secure login
  </div>

</div>

    </div>
  );
}