import mongoose from 'mongoose';


const doctorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    image: {
        type: String
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
});
  
// Tạo model từ schema
const Doctor = mongoose.model('Patient', doctorSchema);

module.exports = Doctor;
