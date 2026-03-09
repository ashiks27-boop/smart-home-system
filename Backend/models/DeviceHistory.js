const mongoose = require("mongoose")

const DeviceHistorySchema = new mongoose.Schema({

deviceId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Device"
},

status:String,

startTime:Date,
endTime:Date,

durationSeconds:Number

},{timestamps:true})

module.exports = mongoose.model("DeviceHistory",DeviceHistorySchema)