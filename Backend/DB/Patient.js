import mongoose from 'mongoose';


const patientSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    birth:{
        type: String
    },
    room:{
        type: Number
    },
    bed: {
        type: Number
    },
    doctorId:{
        type: String
    },
    deviceId: {
        type: String
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
        type: String
    },
    description:{
        type: String
    },
    sensor: {
      flex1: { type: Number },
      flex2: { type: Number },
      flex3: { type: Number },
      flex4: { type: Number },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
});
  
// Tạo model từ schema
const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
