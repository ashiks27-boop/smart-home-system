require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const deviceRoutes = require("./routes/deviceRoutes")
const authRoutes = require("./routes/authRoutes")
const thermRoutes = require("./routes/thermRoutes")
const energyRoutes = require("./routes/energyRoutes")
const predictionRoute = require("./routes/prediction")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/devices", deviceRoutes)
app.use("/api/auth", authRoutes)

app.use("/api/thermdata", thermRoutes);
app.use("/api/energy", energyRoutes)
app.use("/api/predict", predictionRoute)



// Connect MongoDB FIRST, then start server


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected")

    app.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server running on port", process.env.PORT || 5000)
    })
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message)
  })
