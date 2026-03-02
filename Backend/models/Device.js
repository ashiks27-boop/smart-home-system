const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    // ⭐ device type
    name: {
      type: String,
      required: true
    },

    // ⭐ NEW company field
    company: {
      type: String,
      default: ""
    },

    location: {
      type: String,
      required: true
    },

    status: {
      type: String,
      default: "OFF"
    },

    totalOn: {
      type: Number,
      default: 0
    },

    lastOnTime: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);