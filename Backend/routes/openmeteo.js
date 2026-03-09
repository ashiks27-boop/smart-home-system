const express = require("express")
const router = express.Router()
const axios = require("axios")

router.post("/predict", async (req, res) => {

  const { date, viewType } = req.body

  try {

    // Kochi coordinates
    const lat = 9.9312
    const lon = 76.2673

    let days = 1

    if (viewType === "week") days = 7
    
    if (viewType === "month") days = 14

    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast`,
      {
        params:{
          latitude:lat,
          longitude:lon,
          daily:[
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "windspeed_10m_max"
          ].join(","),
          timezone:"auto",
          forecast_days:days
        }
      }
    )

    const data = response.data.daily

    const results = data.time.map((date,i)=>({

      date:date,
      avg_temp:(
        (data.temperature_2m_max[i] +
        data.temperature_2m_min[i]) /2
      ).toFixed(1),

      rainfall:data.precipitation_sum[i],

      wind_speed:data.windspeed_10m_max[i]

    }))

    res.json(results)

  } catch(err){

    console.error(err)
    res.status(500).json({error:"Weather API failed"})

  }

})

module.exports = router