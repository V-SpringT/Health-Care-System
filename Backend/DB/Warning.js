const mongoose = require('mongoose');


const warningSchema = new mongoose.Schema({
    title:{
        type: String
    },
    message:{
        type: String
    }, 
    type: {
        type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
});
  
// Tạo model từ schema
const Warning = mongoose.model('Warning', warningSchema, 'Warning');
module.exports = Warning;
