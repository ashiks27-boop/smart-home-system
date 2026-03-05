const mongoose = require("mongoose")

const scheduleSchema = new mongoose.Schema({

deviceId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Device"
},

onTime:String,
offTime:String

})

module.exports = mongoose.model("Schedule",scheduleSchema)