import mongoose from 'mongoose';


const deviceSchema = new mongoose.Schema({
    patientId: {
        type: String
    },
    doctorId: {
        type: String      
    },  
    message : {
        type: String,
    }
});
  
// Tạo model từ schema
const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
