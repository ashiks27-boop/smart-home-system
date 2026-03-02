const mongoose = require("mongoose");

const deviceUsageSchema = new mongoose.Schema({
  userId: String,
  deviceId: String,
  deviceName: String,
  location: String,
  startTime: Date,
  endTime: Date,
  durationSeconds: Number
}, { timestamps: true });

module.exports = mongoose.model("DeviceUsage", deviceUsageSchema);
