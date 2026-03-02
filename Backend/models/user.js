const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    enum: ["admin", "resident"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("User", UserSchema)
