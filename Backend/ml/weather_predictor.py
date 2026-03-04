# weather_predictor.py

import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime
import sys
import json
import os
import warnings

# Ignore sklearn warnings
warnings.filterwarnings("ignore")

# ================================
# Load Dataset
# ================================

base_dir = os.path.dirname(__file__)
csv_path = os.path.join(base_dir, 'kochi_weather_2015_2024.csv')

weather_df = pd.read_csv(csv_path)

# Rename columns to easier names
weather_df.rename(columns={
    'time': 'date',
    'temperature_2m_max': 'temp_max',
    'temperature_2m_min': 'temp_min',
    'precipitation_sum': 'rainfall'
}, inplace=True)

# Create average temperature
weather_df['temperature'] = (
    weather_df['temp_max'] + weather_df['temp_min']
) / 2

# Convert date column
weather_df['date'] = pd.to_datetime(weather_df['date'])

# Create seasonal feature
weather_df['day_of_year'] = weather_df['date'].dt.dayofyear

# ================================
# Train Models
# ================================

X = weather_df[['day_of_year']]

models = {}

for target in ['temperature', 'rainfall']:

    y = weather_df[target]

    model = LinearRegression()
    model.fit(X, y)

    models[target] = model

# ================================
# Read Input from Node Backend
# ================================

input_data = json.loads(sys.stdin.read())
dates = input_data.get("dates", [])

results = []

# ================================
# Prediction Loop
# ================================

for date_str in dates:

    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        continue

    doy = date_obj.timetuple().tm_yday

    # FIXED: Use DataFrame with column name
    input_df = pd.DataFrame(
        [[doy]],
        columns=['day_of_year']
    )

    temp_pred = models['temperature'].predict(input_df)[0]
    rain_pred = models['rainfall'].predict(input_df)[0]

    # Smart thermostat suggestion
    eco_mode = 24 if temp_pred > 30 else 26
    comfort_mode = 22

    results.append({
        "date": date_str,
        "predicted_temperature": round(temp_pred, 2),
        "predicted_rainfall": round(rain_pred, 2),
        "eco_mode_degree": eco_mode,
        "comfort_mode_degree": comfort_mode
    })

# ================================
# Output JSON for Node.js
# ================================

print(json.dumps(results))