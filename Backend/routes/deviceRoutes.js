const express = require("express");

const {
  addDevice,
  getDevices,
  toggleDevice,
  deleteDevice,
  getSingleDevice,
  getDeviceHistory,
  predictNextOnOff,
  getDeviceStatus,
} = require("../controllers/deviceController");

const router = express.Router();

// Add new device
router.post("/", addDevice);

// Toggle device ON/OFF
router.put("/toggle/:id", toggleDevice);

// Get single device
router.get("/single/:id", getSingleDevice);

// Device usage history
router.get("/history/:id", getDeviceHistory);

// Prediction
router.get("/predict/:id", predictNextOnOff);

// Device status
router.get("/:id/status", getDeviceStatus);

// Delete device
router.delete("/:id", deleteDevice);

// ⚠️ ALWAYS KEEP THIS LAST
router.get("/:userId", getDevices);

module.exports = router;