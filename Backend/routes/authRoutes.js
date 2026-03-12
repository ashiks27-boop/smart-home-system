const express = require("express")
const router = express.Router()

const User = require("../models/user")   // ✅ IMPORT USER MODEL

const {
  verifyPhone,
  verifyOTP
} = require("../controllers/authController")

// STAGE 1 - Send OTP
router.post("/phone", verifyPhone)

// STAGE 2 - Verify OTP
router.post("/otp", verifyOTP)

// CHECK IF USER EXISTS
router.post("/check-user", async (req, res) => {

  try {

    const { phone } = req.body

    const user = await User.findOne({ phone })

    if (user) {
      res.json({ exists: true })
    } else {
      res.json({ exists: false })
    }

  } catch (err) {

    console.log(err)
    res.status(500).json({ message: "Server error" })

  }

})

module.exports = router