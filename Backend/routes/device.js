const express = require("express")
const router = express.Router()
const Device = require("../models/device")

/* ===============================
   GET ALL DEVICES
================================ */
router.get("/devices", async (req, res) => {
  try {
    const devices = await Device.find()
    res.json(devices)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch devices" })
  }
})

/* ===============================
   GET DEVICES BY USER ID
================================ */
router.get("/devices/:userId", async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.params.userId })
    res.json(devices)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user devices" })
  }
})

/* ===============================
   ADD NEW DEVICE
================================ */
router.post("/devices", async (req, res) => {
  try {
    const { name, company, location, status, userId } = req.body

    const newDevice = new Device({
      name,
      company,
      location,
      status: status || "OFF",
      userId
    })

    await newDevice.save()
    res.status(201).json(newDevice)

  } catch (err) {
    res.status(500).json({ error: "Failed to create device" })
  }
})

/* ===============================
   UPDATE DEVICE STATUS (ON/OFF)
================================ */
router.put("/devices/:id", async (req, res) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )

    res.json(updatedDevice)
  } catch (err) {
    res.status(500).json({ error: "Failed to update device" })
  }
})

/* ===============================
   DELETE DEVICE
================================ */
router.delete("/devices/:id", async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id)
    res.json({ message: "Device deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete device" })
  }
})

module.exports = router