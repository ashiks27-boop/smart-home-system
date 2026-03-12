import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

export default function PhoneLogin() {

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");

  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [cleanedPhone, setCleanedPhone] = useState("");

  const navigate = useNavigate();

  const validateName = (value) => {
    if (value.length < 2) {
      return "Name must be at least 2 characters";
    }
    return "";
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value));
  };

  const sendOTP = async (phoneNumber) => {

    const res = await API.post("/phone", {
      phone: phoneNumber,
      name: name.trim()
    });

    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("userName", name.trim());
    localStorage.setItem("otpAllowed", "true");

    navigate("/otp");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameValidationError = validateName(name);
    if (nameValidationError) {
      alert(nameValidationError);
      return;
    }

    if (!phone.trim()) {
      alert("Enter phone number");
      return;
    }

    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length !== 10) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    setCleanedPhone(cleaned);

    try {

      setLoading(true);

      const res = await API.post("/check-user", {
        phone: cleaned
      });

      if (res.data.exists) {

        await sendOTP(cleaned);

      } else {

        setShowRegisterPopup(true);

      }

    } catch {

      alert("Server error");

    } finally {

      setLoading(false);

    }
  };

  const handleRegister = async () => {

    try {

      setLoading(true);

      await API.post("/register", {
        name: name.trim(),
        phone: cleanedPhone
      });

      await sendOTP(cleanedPhone);

    } catch {

      alert("Registration failed");

    } finally {

      setShowRegisterPopup(false);
      setLoading(false);

    }

  };

  return (
    <div className="premium-login-container">

      {/* LEFT SECTION */}
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
                <span className="feature-icon">💡</span>
              </div>
              <div className="feature-text">
                <h4>Smart Lighting</h4>
                <p>Adaptive brightness & schedules</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🔐</span>
              </div>
              <div className="feature-text">
                <h4>Secure Access</h4>
                <p>Two-factor authentication</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📊</span>
              </div>
              <div className="feature-text">
                <h4>Energy Analytics</h4>
                <p>Live consumption tracking</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🌦️</span>
              </div>
              <div className="feature-text">
                <h4>Weather Automation</h4>
                <p>Climate-adaptive control</p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* RIGHT LOGIN */}
      <div className="premium-login-card">

        <div className="login-card-content">

          <div className="welcome-badge">
            <span className="welcome-icon">👋</span>
            <span>Welcome back!</span>
          </div>

          <div className="login-header">
            <h2>Sign in to continue</h2>
            <p>Enter your credentials to access your smart home</p>
          </div>

          <div className="decorative-line">
            <span className="line"></span>
            <span className="line-icon">🔒</span>
            <span className="line"></span>
          </div>

          <form onSubmit={handleSubmit} className="premium-form">

            <div className="form-field">
              <div className="field-label">
                <span className="label-main">FULL NAME</span>
              </div>

              <div className="input-container">
                <input
                  type="text"
                  placeholder="e.g., John A. Doe"
                  value={name}
                  onChange={handleNameChange}
                  required
                  className={`premium-input ${nameError ? "input-error" : name ? "input-filled" : ""}`}
                />
                <span className="input-icon">👤</span>
              </div>

              {nameError && (
                <div className="field-error">
                  <span className="error-icon">⚠️</span>
                  <span>{nameError}</span>
                </div>
              )}

            </div>

            <div className="form-field">
              <div className="field-label">
                <span className="label-main">PHONE NUMBER</span>
              </div>

              <div className="input-container">
                <input
                  type="tel"
                  placeholder="e.g., 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={`premium-input ${phone ? "input-filled" : ""}`}
                />
                <span className="input-icon">📱</span>
              </div>

            </div>

            <button
              type="submit"
              className="premium-login-btn"
              disabled={loading || !!nameError}
            >
              {loading ? "Checking..." : "SEND VERIFICATION CODE"}
            </button>

          </form>

          <div className="security-badge">
            <div className="security-icon">🛡️</div>
            <div className="security-text">
              <strong>OTP Verification</strong>
              <span>Secure 2-factor authentication</span>
            </div>
          </div>

        </div>
      </div>

      {/* REGISTER POPUP */}
      {showRegisterPopup && (
  <div className="register-popup-overlay">

    <div className="register-popup-card">

      <div className="popup-icon">👤</div>

      <h3 className="popup-title">New User Detected</h3>

      <p className="popup-text">
        This phone number is not registered.
        <br />
        Do you want to create a SmartHome account?
      </p>

      <div className="popup-buttons">

        <button
          className="popup-btn confirm"
          onClick={handleRegister}
        >
          Yes, Register
        </button>

        <button
          className="popup-btn cancel"
          onClick={() => setShowRegisterPopup(false)}
        >
          Cancel
        </button>

      </div>

    

          </div>

        </div>
      )}

    </div>
  );
}