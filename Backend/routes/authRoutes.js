const express = require("express")
const router = express.Router()

const {
  verifyPhone,
  verifyOTP
} = require("../controllers/authController")

// STAGE 1
router.post("/phone", verifyPhone)

// STAGE 2
router.post("/otp", verifyOTP)

module.exports = router
