const express = require("express")
const router = express.Router()
const { spawn } = require("child_process")

router.get("/:deviceId", (req, res) => {

  const deviceId = req.params.deviceId

const path = require("path")

const scriptPath = path.join(__dirname, "../ml/predict_on_off.py")

const python = spawn("python", [
  scriptPath,
  deviceId
])
  let dataToSend = ""

  python.stdout.on("data", (data) => {
    dataToSend += data.toString()
  })

  python.stderr.on("data", (data) => {
    console.error(`Python error: ${data}`)
  })

  python.on("close", () => {
    try {
      const result = JSON.parse(dataToSend)
      res.json(result)
    } catch (err) {
      res.status(500).json({ error: "Prediction failed" })
    }
  })

})

module.exports = router