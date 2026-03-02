const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema(
  {
    userId: String,
    message: String,
    status: {
      type: String,
      default: "Open"
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Feedback", feedbackSchema)