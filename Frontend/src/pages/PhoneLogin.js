import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");

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

  const cleanedPhone = phone.replace(/\D/g, "");

  if (cleanedPhone.length !== 10) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  try {
    setLoading(true);

    const res = await API.post("/phone", {
      phone: cleanedPhone,
      name: name.trim()
    });

    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("userName", name.trim());
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

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">10k+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">50k+</span>
              <span className="stat-label">Devices Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN SECTION - REDESIGNED */}
      <div className="premium-login-card">
        <div className="login-card-content">
          {/* Welcome Badge */}
          <div className="welcome-badge">
            <span className="welcome-icon">👋</span>
            <span>Welcome back!</span>
          </div>

          {/* Header */}
          <div className="login-header">
            <h2>Sign in to continue</h2>
            <p>Enter your credentials to access your smart home</p>
          </div>

          {/* Decorative Line */}
          <div className="decorative-line">
            <span className="line"></span>
            <span className="line-icon">🔒</span>
            <span className="line"></span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="premium-form">
            {/* Name Field */}
            <div className="form-field">
              <div className="field-label">
                <span className="label-main">FULL NAME</span>
               
              </div>
              
              <div className="input-container">
                <input
                  type="text"
                  id="fullName"
                  placeholder="e.g., John A. Doe"
                  value={name}
                  onChange={handleNameChange}
                  required
                  className={`premium-input ${nameError ? 'input-error' : name ? 'input-filled' : ''}`}
                  autoComplete="name"
                />
                <span className="input-icon">👤</span>
                {name && !nameError && (
                  <span className="input-valid">✓</span>
                )}
              </div>

              {nameError && (
                <div className="field-error">
                  <span className="error-icon">⚠️</span>
                  <span>{nameError}</span>
                </div>
              )}

              
            </div>

            {/* Phone Field */}
            <div className="form-field">
              <div className="field-label">
                <span className="label-main">PHONE NUMBER</span>
              </div>
              
              <div className="input-container">
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="e.g., +1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={`premium-input ${phone ? 'input-filled' : ''}`}
                  autoComplete="tel"
                />
                <span className="input-icon">📱</span>
              </div>

             
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="premium-login-btn"
              disabled={loading || !!nameError}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="loading-spinner"></span>
                  SENDING VERIFICATION CODE...
                </span>
              ) : (
                <span className="btn-text">
                  SEND VERIFICATION CODE
                  <span className="btn-icon">→</span>
                </span>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className="security-badge">
            <div className="security-icon">🛡️</div>
            <div className="security-text">
              <strong>OTP Verification</strong>
              <span>Secure 2-factor authentication</span>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}