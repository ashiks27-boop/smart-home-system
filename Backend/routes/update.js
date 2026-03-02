const express = require("express")
const router = express.Router()
const Update = require("../models/Update")

// POST update (Admin adds update)
router.post("/updates", async (req, res) => {
  try {
    const update = new Update(req.body)
    await update.save()
    res.json({ message: "Update added successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to add update" })
  }
})

// GET updates (Residents view)
router.get("/updates", async (req, res) => {
  try {
    const updates = await Update.find().sort({ createdAt: -1 })
    res.json(updates)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch updates" })
  }
})

module.exports = router