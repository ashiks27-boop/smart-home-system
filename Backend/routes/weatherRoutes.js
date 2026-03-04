const express = require("express")
const router = express.Router()
const { spawn } = require("child_process")
const path = require("path")

router.post("/predict", (req, res) => {

  const { dates } = req.body

  const pythonProcess = spawn("python", [
    path.join(__dirname, "../ml/weather_predictor.py")
  ])

  let result = ""

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString()
  })

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString())
  })

  pythonProcess.on("close", () => {
    try {
      const parsed = JSON.parse(result)
      res.json(parsed)
    } catch (err) {
      res.status(500).json({ error: "Prediction parsing failed" })
    }
  })

  pythonProcess.stdin.write(JSON.stringify({ dates }))
  pythonProcess.stdin.end()

})

module.exports = router