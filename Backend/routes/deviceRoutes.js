const express = require("express");

const {
  addDevice,
  getDevices,
  toggleDevice,
  deleteDevice,
  getSingleDevice,
  getDeviceHistory,
  predictNextOnOff 
} = require("../controllers/deviceController");

const router = express.Router();

router.post("/", addDevice);
router.put("/toggle/:id", toggleDevice);
router.get("/single/:id", getSingleDevice);
router.get("/history/:id", getDeviceHistory);
router.get("/predict/:id", predictNextOnOff);

// ⚠️ ALWAYS LAST
router.get("/:userId", getDevices);

router.delete("/:id", deleteDevice);


module.exports = router;
