const express = require("express");
const router = express.Router();
const DeviceUsage = require("../models/DeviceUsage");

router.get("/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { range } = req.query;

    let startDate = new Date();

    if (range === "day") {
      startDate.setHours(0, 0, 0, 0);
    }

    if (range === "week") {
      startDate.setDate(startDate.getDate() - 7);
    }

    if (range === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    let filter = { deviceId: deviceId.toString() };

    if (range) {
      filter.startTime = { $gte: startDate };
    }

    const usages = await DeviceUsage.find(filter);

    const DEVICE_WATT = 10;

    let chartMap = {};
    let events = [];

    usages.forEach((u) => {
      const hours = u.durationSeconds / 3600;
      const kWh = (DEVICE_WATT * hours) / 1000;

      const dateKey = new Date(u.startTime).toLocaleDateString();

      if (!chartMap[dateKey]) chartMap[dateKey] = 0;
      chartMap[dateKey] += kWh;

      events.push({
        status: "Off",
        startTime: u.startTime,
        endTime: u.endTime,
        kWh: kWh.toFixed(5),
      });
    });

    const chartData = Object.keys(chartMap).map((date) => ({
      date,
      kWh: Number(chartMap[date].toFixed(5)),
    }));

    res.json({ chartData, events });

  } catch (err) {
    console.error("Energy Route Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;