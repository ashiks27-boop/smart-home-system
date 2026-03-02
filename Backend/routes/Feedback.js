const express = require("express")
const router = express.Router()
const Feedback = require("../models/Feedback")

// POST feedback (Resident submits)
router.post("/feedback", async (req, res) => {
  try {
    const feedback = new Feedback(req.body)
    await feedback.save()
    res.json({ message: "Feedback submitted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to save feedback" })
  }
})

// GET all feedback (Admin view)
router.get("/feedback", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 })
    res.json(feedback)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch feedback" })
  }
})

module.exports = router