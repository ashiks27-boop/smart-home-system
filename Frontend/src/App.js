import { BrowserRouter, Routes, Route } from "react-router-dom"

import PhoneLogin from "./pages/PhoneLogin"
import OTPPage from "./pages/OTPPage"
import ResidentDashboard from "./pages/ResidentDashboard"
import ResidentDevices from "./pages/ResidentDevices"
import AdminDashboard from "./pages/AdminDashboard"
import ResidentLocations from "./pages/ResidentLocations"
import DeviceDetails from "./pages/DeviceDetails";
import ResidentReports from "./pages/ResidentReports"
import FanUsageReport from "./pages/FanUsageReport"
import LightUsageReport from "./pages/LightUsageReport"
import EnergyConsumptionReport from "./pages/EnergyConsumptionReport"
import ThermReport from "./pages/ThermReport"
import PredictiveReport from "./pages/PredictiveReport"
import LightPrediction from "./pages/LightPrediction"
import PowerPrediction from "./pages/PowerPrediction"
import WeatherPrediction from "./pages/WeatherPrediction"
import UpdateLog from "./pages/UpdateLog";
import AdminFeedback from "./pages/AdminFeedback"
import ResidentFeedback from "./pages/ResidentFeedback"
import ResidentUpdateLog from "./pages/ResidentUpdateLog"
import FanUsagePrediction from "./pages/FanUsagePrediction"
import TimePrediction from "./pages/TimePrediction"
import ThermostatPrediction from "./pages/ThermostatPrediction"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PhoneLogin />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/resident" element={<ResidentDashboard />} />
        <Route path="/devices" element={<ResidentDevices />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/update-log" element={<UpdateLog />} />
        <Route path="/locations" element={<ResidentLocations />} />
        <Route path="/reports" element={<ResidentReports />} />
        <Route path="/predictive" element={<PredictiveReport />} />
        <Route path="/predictive/light" element={<LightPrediction />} />
        <Route path="/predictive/power" element={<PowerPrediction />} />
        <Route path="/predictive/weather" element={<WeatherPrediction />} />
         <Route path="/fan-prediction" element={<FanUsagePrediction />} />
         <Route path="/predictive/time" element={<TimePrediction />} />
       <Route path="/admin/feedback" element={<AdminFeedback />} />

<Route path="/resident/feedback" element={<ResidentFeedback />} />
<Route path="/resident/update-log" element={<ResidentUpdateLog />} />






       {/* ✅ THIS IS THE KEY ROUTE */}
        <Route path="/device-details" element={<DeviceDetails />} />
     
    

<Route path="/reports/fan" element={<FanUsageReport />} />
<Route path="/reports/light" element={<LightUsageReport />} />
<Route path="/reports/energy" element={<EnergyConsumptionReport />} />
<Route path="/reports/thermostat" element={<ThermReport />} />
<Route path="/thermo-prediction" element={<ThermostatPrediction />} />


        

      </Routes>
    </BrowserRouter>
  )
}

export default App

