const Device = require("../models/Device")
const DeviceUsage = require("../models/DeviceUsage")

// ➕ Add Device
exports.addDevice = async (req, res) => {
  try {
    console.log("Incoming device request:", req.body)

    // ⭐ ADDED company (DO NOT REMOVE EXISTING)
    const { userId, name, location, company } = req.body

    if (!userId || !name || !location) {
      return res.status(400).json({ message: "Missing fields" })
    }

    const device = await Device.create({
      userId,
      name,               // device type (AC, Light, Fan)
      company: company || "",   // ⭐ NEW FIELD (LG, Samsung, etc)
      location,
      status: "OFF",
      totalOn: 0,
      lastOnTime: null
    })

    return res.status(201).json(device)
  } catch (err) {
    console.error("Add Device Error:", err)
    return res.status(500).json({ error: err.message })
  }
}

// 📥 Get Devices By User
exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    return res.json(devices)
  } catch (err) {
    console.error("Get Devices Error:", err)
    return res.status(500).json({ error: err.message })
  }
}

// 🔄 Toggle ON/OFF
exports.toggleDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)

    if (!device) {
      return res.status(404).json({ error: "Device not found" })
    }

    const now = new Date()

    if (device.status === "OFF") {
      device.status = "ON"
      device.lastOnTime = now
      await device.save()

      return res.json({
        message: "Device turned ON",
        device
      })
    }

    if (device.status === "ON") {
      const startTime = device.lastOnTime || now
      const durationSeconds = Math.max(1, Math.round((now - startTime) / 1000))

      await DeviceUsage.create({
        userId: device.userId,
        deviceId: device._id.toString(),
        deviceName: device.name,
        location: device.location,
        startTime,
        endTime: now,
        durationSeconds
      })

      device.totalOn += durationSeconds
      device.status = "OFF"
      device.lastOnTime = null
      await device.save()

      return res.json({
        message: "Device turned OFF",
        device
      })
    }

  } catch (err) {
    console.error("Toggle Error:", err)
    return res.status(500).json({
      error: "Toggle failed",
      details: err.message
    })
  }
}

// ❌ Delete Device
exports.deleteDevice = async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id)
    return res.json({ message: "Device deleted" })
  } catch (err) {
    console.error("Delete Error:", err)
    return res.status(500).json({ error: err.message })
  }
}

// 🔍 Get Single Device
exports.getSingleDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)

    if (!device) {
      return res.status(404).json({ message: "Device not found" })
    }

    return res.json(device)
  } catch (err) {
    console.error("Get Single Device Error:", err)
    return res.status(500).json({ error: err.message })
  }
}

// 📜 Get Device Usage History
exports.getDeviceHistory = async (req, res) => {
  try {
    const deviceId = req.params.id;

    const history = await DeviceUsage.find({ deviceId })
      .sort({ startTime: -1 });

    res.json(history);
  } catch (err) {
    console.error("History Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const { execFile } = require("child_process");
const path = require("path");

exports.predictNextOnOff = (req, res) => {
  const deviceId = req.params.id;

  const scriptPath = path.join(
    __dirname,
    "../ml/predict_on_off.py"
  );

  execFile(
    "python",
    [scriptPath, deviceId],
    (error, stdout) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      try {
        const result = JSON.parse(stdout);
        res.json(result);
      } catch {
        res.status(500).json({ error: "Invalid prediction output" });
      }
    }
  );
};