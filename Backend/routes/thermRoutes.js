const express = require("express");
const router = express.Router();
const ThermData = require("../models/ThermData");

// GET all thermostat history
router.get("/", async (req, res) => {
  try {
    const data = await ThermData.find().sort({ timestamp: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch therm data" });
  }
});

// ADD history (for testing)
router.post("/", async (req, res) => {
  try {
    const saved = await ThermData.create(req.body);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to save therm data" });
  }
});

module.exports = router;