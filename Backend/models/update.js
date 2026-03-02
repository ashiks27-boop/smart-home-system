const mongoose = require("mongoose")

const updateSchema = new mongoose.Schema(
  {
    message: String,
    type: String
  },
  { timestamps: true }
)

module.exports = mongoose.model("Update", updateSchema)