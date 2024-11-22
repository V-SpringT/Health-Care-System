const mongoose = require('mongoose');
const connect = async ()=>{
    try{
        await mongoose.connect(process.env.mongoURL);
        console.log("Connect success")
    }
    catch(error){
        console.log(error)
        console.log("Connect Error")
    }
}

module.exports = connect