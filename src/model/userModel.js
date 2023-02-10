const mongoose = require('mongoose')

const objectId = mongoose.Schema.Types.ObjectId


const userCreate= new mongoose.Schema({
  name :String,
  email :String,
  password :String,
  phone :Number,
  category :{type: String, default :"regular" ,enum :["regular", "gold", "platinum"]},
  order:{type:Number,default:0},
  balance : {type:Number,default:200},
  address: {
          city: {
                type: String  
          },
          pincode: {
                type: Number
          }
    }
})

module.exports= mongoose.model('user',userCreate)