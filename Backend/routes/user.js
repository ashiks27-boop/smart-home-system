const express = require("express")
const router = express.Router()
const User = require("../models/user")

// Get only residents
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "resident" })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

module.exports = router