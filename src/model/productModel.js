const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId


const productCreate= new mongoose.Schema({

  productName :String,
  quantity : {type:Number,default:1},
  price:{type:Number,default:100},
  isDeleted:{type :Boolean,default:false}


})

module.exports= mongoose.model('order',productCreate)