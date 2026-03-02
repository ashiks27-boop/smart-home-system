const mongoose = require("mongoose");

const thermSchema = new mongoose.Schema({
  deviceId: String,
  timestamp: Date,
  targetTemperature: Number,
  weatherTemperature: Number,
  mode: String,
  durationMinutes: Number,
  durationHours: Number
});

module.exports = mongoose.model("ThermData", thermSchema);