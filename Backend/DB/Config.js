const mongoose = require('mongoose');


const configSchema = new mongoose.Schema({
    heartMin: {
        type: Number,
    },
    heartMax: {
        type: Number,
    },
    temperatureMin: {
        type: Number,
    },
    temperatureMax: {
        type: Number
    },
    flex1:{
        type: String
    },
    flex2: {
        type: String
    },
    flex3: {
        type: String
    },
    flex4: {
        type: String
    }
});
  
// Tạo model từ schema
const Config = mongoose.model('Config', configSchema, 'Config');
module.exports =  Config;
