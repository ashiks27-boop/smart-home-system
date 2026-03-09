require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const deviceRoutes = require("./routes/deviceRoutes")
const authRoutes = require("./routes/authRoutes")
const thermRoutes = require("./routes/thermRoutes")
const energyRoutes = require("./routes/energyRoutes")
const predictionRoute = require("./routes/prediction")
const feedbackRoutes = require("./routes/feedback")
const updateRoutes = require("./routes/update")
const userRoutes = require("./routes/user")
const weatherRoutes = require("./routes/weatherRoutes")
const openmeteo = require("./routes/openmeteo")

const Device = require("./models/Device") // ⭐ needed for automation

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/devices", deviceRoutes)
app.use("/api/auth", authRoutes)

app.use("/api/thermdata", thermRoutes)
app.use("/api/energy", energyRoutes)
app.use("/api/predict", predictionRoute)
app.use("/api", feedbackRoutes)
app.use("/api", updateRoutes)
app.use("/api", userRoutes)
app.use("/api/weather", weatherRoutes)
app.use("/api/openmeteo", openmeteo)


// ⭐ DEVICE AUTOMATION STORAGE
let schedules = []

// ⭐ API to save automation schedule
app.post("/api/devices/schedule", (req, res) => {

  const { deviceId, onTime, offTime } = req.body

  schedules.push({
    deviceId,
    onTime,
    offTime
  })

  console.log("Automation saved:", schedules)

  res.json({ message: "Automation schedule saved" })
})


// ⭐ AUTOMATION WORKER (runs every minute)
setInterval(async () => {

  const now = new Date()

  const hours = String(now.getHours()).padStart(2,"0")
  const minutes = String(now.getMinutes()).padStart(2,"0")

  const currentTime = `${hours}:${minutes}`

  for (const schedule of schedules) {

    try {

      if (currentTime === schedule.onTime) {

        await Device.findByIdAndUpdate(
          schedule.deviceId,
          { status: "ON" }
        )

        console.log("Device turned ON automatically at", currentTime)

      }

      if (currentTime === schedule.offTime) {

        await Device.findByIdAndUpdate(
          schedule.deviceId,
          { status: "OFF" }
        )

        console.log("Device turned OFF automatically at", currentTime)

      }

    } catch (err) {

      console.log("Automation error:", err.message)

    }

  }

}, 5000)


// Connect MongoDB FIRST, then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected")

    const PORT = process.env.PORT || 5000

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on port", PORT)
})
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message)
  })