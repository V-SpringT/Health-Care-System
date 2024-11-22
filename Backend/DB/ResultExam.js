const mongoose = require('mongoose');


const resultExamSchema = new mongoose.Schema({
    doctorId: {
        type: String,
    },
    patientId: {
        type: String,
    },
    heartRate:{
        type: Number,
    },
    temperature:{
        type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
});
  
// Tạo model từ schema
const ResultExam = mongoose.model('ResultExam', resultExamSchema, 'ResultExam');
module.exports = ResultExam;
