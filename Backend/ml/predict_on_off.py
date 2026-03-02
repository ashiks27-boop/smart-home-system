import sys
from pymongo import MongoClient
from datetime import timedelta
import json

# 1️⃣ Read deviceId from Node
device_id = sys.argv[1]

# 2️⃣ MongoDB connection
MONGO_URI = "mongodb+srv://Smarthome:Ym3o1TxjCP6QRy29@cluster0.sbdcoft.mongodb.net/smarthomeauth?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client.get_database()

# 3️⃣ Fetch usage records (deviceId stored as STRING in your DB)
usage = list(db.deviceusages.find(
    {"deviceId": device_id},
    {"_id": 0, "startTime": 1, "endTime": 1, "durationSeconds": 1}
).sort("startTime", 1))

# Debug (you can remove later)
# print("Total usage records found:", len(usage))

# 4️⃣ Need at least 2 records
if len(usage) < 2:
    print(json.dumps({
        "message": "Not enough data for prediction"
    }))
    sys.exit(0)

# 5️⃣ Calculate ON gaps & durations
on_gaps = []
durations = []

for i in range(1, len(usage)):
    prev_on = usage[i-1]["startTime"]
    curr_on = usage[i]["startTime"]
    on_gaps.append((curr_on - prev_on).total_seconds())

for u in usage:
    durations.append(u["durationSeconds"])

avg_on_gap = sum(on_gaps) / len(on_gaps)
avg_duration = sum(durations) / len(durations)

last_on = usage[-1]["startTime"]

predicted_on = last_on + timedelta(seconds=avg_on_gap)
predicted_off = predicted_on + timedelta(seconds=avg_duration)

# 6️⃣ Energy Estimation
DEVICE_POWER_KW = 0.06  # adjust later dynamically if needed
electricity_rate = 6     # ₹ per kWh

avg_hours = avg_duration / 3600

next_day_kwh = avg_hours * DEVICE_POWER_KW
next_month_kwh = next_day_kwh * 30
estimated_bill = next_month_kwh * electricity_rate

# 7️⃣ Return ONLY ONE JSON
print(json.dumps({
    "averageOnGapMinutes": round(avg_on_gap / 60, 2),
    "averageUsageMinutes": round(avg_duration / 60, 2),
    "predictedNextOnTime": predicted_on.isoformat(),
    "predictedNextOffTime": predicted_off.isoformat(),
    "nextDayKWh": round(next_day_kwh, 3),
    "nextMonthKWh": round(next_month_kwh, 2),
    "estimatedMonthlyBill": round(estimated_bill, 2)
}))