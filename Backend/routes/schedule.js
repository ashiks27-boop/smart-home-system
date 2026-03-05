const express = require("express");
const router = express.Router();

let schedules = [];

router.post("/schedule",(req,res)=>{

  const {deviceId,onTime,offTime} = req.body;

  schedules.push({
    deviceId,
    onTime,
    offTime
  });

  res.json({message:"Schedule saved"});

});

module.exports = router;