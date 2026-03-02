const User = require("../models/User")

const OTP = "1234" // Hardcoded OTP

// ===============================
// STAGE 1: Phone Number Verification
// ===============================
exports.verifyPhone = async (req, res) => {
  try {
    const { phone, name } = req.body

    // Validation
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" })
    }

    // Find user by phone
    let user = await User.findOne({ phone })

    // If user does NOT exist → Create Resident ONLY
    if (!user) {
      user = await User.create({
        name: name || "Resident",
        phone,
        role: "resident" // ⚠️ Never create admin from frontend
      })
    }

    return res.status(200).json({
      message: "OTP sent successfully",
      userId: user._id,
      role: user.role
    })
  } catch (error) {
    console.error("Verify Phone Error:", error.message)
    return res.status(500).json({ error: "Server error" })
  }
}

// ===============================
// STAGE 2: OTP Verification
// ===============================
exports.verifyOTP = async (req, res) => {
  try {
    const { otp, userId } = req.body

    // Validation
    if (!otp || !userId) {
      return res.status(400).json({ message: "OTP and User ID are required" })
    }

    // Check OTP
    if (otp !== OTP) {
      return res.status(401).json({ message: "Invalid OTP" })
    }

    // Find user
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    console.log("LOGIN ROLE:", user.role)

    return res.status(200).json({
      message: "Login successful",
      role: user.role,
      name: user.name
    })
  } catch (error) {
    console.error("Verify OTP Error:", error.message)
    return res.status(500).json({ error: "Server error" })
  }
}
