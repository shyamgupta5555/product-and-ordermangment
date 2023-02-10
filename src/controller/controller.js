
const userModel = require('../model/userModel')
const productModel = require('../model/productModel')
const orderModel = require('../model/orderModel')
const nodemailer = require('nodemailer')
const { default: mongoose } = require('mongoose')

const objectIdValid = mongoose.Types.ObjectId
const validPassword = (password) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password)
const validName = (value) => /^[a-zA-Z ]{3,50}$/.test(value);
const validRegex = (value) => /^[a-zA-Z ]{3,50}$/.test(value);

const validMail = (email) => /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email);
const validNumber = (phone) => (/^[6-9]{1}?[0-9]{9}$/).test(phone);
const Number = (value) => (/^[0-9]{1,10}$/).test(value);


// ============================ create user ===================================//

exports.createUser = async (req,res)=>{
  try{
    
let data = req.body
let {name,email ,password ,phone,order,category,balance,address,...rest}= data

if(Object.keys(rest).length >0)return res.status(400).send({status: false ,message: "provide only valid fields"})

if(! name)return res.status(400).send({status:false ,message: "please send name"})
if(!validName(name))return res.status(400).send({status:false ,message: "please send valid name"})

if(! email)return res.status(400).send({status:false ,message: "please send email"})
if(! validMail(email))return res.status(400).send({status:false ,message: "please send valid email"})

if(! password)return res.status(400).send({status:false ,message: "please send password"})
if(! validPassword(password))return res.status(400).send({status:false ,message: "please send valid password"})

if(! phone)return res.status(400).send({status:false ,message: "please send phone number"})
if(! validNumber(phone))return res.status(400).send({status:false ,message: "please send  valid phone number"})

if(! address)return res.status(400).send({status:false ,message: "please send address"})

if(!address.city)return res.status(400).send({status:false ,message: "please send  city address"})
if(!validRegex(address.city))return res.status(400).send({status:false ,message: "please send valid city address"})

if(! address.pincode)return res.status(400).send({status:false ,message: "please send  pincode address"})
if(! Number(address.pincode))return res.status(400).send({status:false ,message: "please send valid pincode address"})


if(! order)return res.status(400).send({status:false ,message: "please send order"})
if(! Number(order))return res.status(400).send({status:false ,message: "please send valid order number"})


if(! category)return res.status(400).send({status:false ,message: "please send category"})
let arr = ["regular", "gold", "platinum"]
if(! arr.includes(category))return res.status(400).send({status:false ,message: "please send valid category"})



let verify = await userModel.findOne({$or:[{ email: email },{ phone: phone }]})
if (verify) {
      return res.status(400).send({ status: false, message: "email is already exist! please enter another email address  and phone" })
}


let transport = nodemailer.createTransport(
  { service : 'gmail',
   auth : {user : 'rahulsaran820@gmail.com',pass : 'kudupemqdaegzwpv'}}
    )

  let mailOptions = {
      from : 'shyamgupta0214@gmail.com',
      to :email,
      subject : `"Hello"${name}`,
      text :` hii ${name} your account successfully created`
  }

      transport.sendMail(mailOptions,function(err,info){
      if(err)return console.log(err.message)
     if(info)return consol.log('Email Sent' + info.response)
     
  })


let createUser= await userModel.create(data)
return res.status(201).send({status:true , message : "create user", data:createUser})

}catch(err){
  return res.status(500).send({status:false,message :err.message})
}
}



// ============================= create product ========================//


exports.createProduct = async (req,res)=>{
try{
let data =  req.body
let {productName ,quantity, price}= data

if(! productName)return res.status(400).send({status: false ,message:"provide product name "})
if(! validRegex(productName))return res.status(400).send({status: false ,message:"provide valid product name "})

if(! quantity)return res.status(400).send({status: false ,message:"provide quantity"})
if(! Number(quantity))return res.status(400).send({status: false ,message:"provide  valid quantity"})


if(! price)return res.status(400).send({status: false ,message:"provide price"})
if(! Number(price))return res.status(400).send({status: false ,message:"provide  valid price"})


let createProduct = await productModel.create(data)
res.status(201).send({status:true,data : createProduct})

}catch(err){
  return res.status(500).send({status:false,message :err.message})
}
}


// =========================== create order=====================//

exports.createOrder = async (req,res)=>{
  try{
  let data =  req.body
  let{userId, demandQuantity, productId,paymentStatus, ...rest}= data

if(Object.keys(rest).length >0)return res.status(400).send({status: false ,message: "provide only valid fields"})


if(! userId)return res.status(400).send({status:false ,message: "please send userId"})
if(! objectIdValid(userId) )return res.status(400).send({status:false ,message: "please send valid userId"})

if(! demandQuantity)return res.status(400).send({status:false ,message: "please send demand quantity"})
if(! Number(demandQuantity))return res.status(400).send({status:false ,message: "please send  valid demand quantity only number"})

if(! productId)return res.status(400).send({status:false ,message: "please send phone productid"})
if(! objectIdValid(productId))return res.status(400).send({status:false ,message: "please send phone productid"})


  let checkUser = await userModel.findById({_id:userId})
  if(!checkUser)return res.status(404).send({status: false , message : " user id is not found"})

  let checkProduct = await productModel.findOne({_id:productId ,isDeleted :false})
  if(!checkProduct)return res.status(404).send({status: false , message : "product id is not found"})

  let userObj = { }
  if(checkUser.order>10){userObj.category ="gold"}
  if(checkUser.order>20){userObj.category ="platinum"}

  if(demandQuantity > checkProduct.quantity)return res.status(400).send({status: false , message : " quantity is greater then product quantity"})

  let amount = (checkProduct.price *demandQuantity)

  if(checkUser.category == "gold"){ amount =( amount - amount*0.1)}
  if(checkUser.category == "platinum"){ amount = (amount - amount*0.2)}

  if(checkUser.balance < amount){
    return res.status(400).send({status: false , message : `insufficient balance you must have ${amount - checkUser.balance}₹ extra`})}

  data.totalAmount =amount
  data.productName= checkProduct.productName
  let createOrder = await orderModel.create(data)

  let d=await productModel.findByIdAndUpdate({_id:productId}, {$inc: {quantity:-demandQuantity}},{new: true})
    console.log(d,checkProduct.quantity)

let f=  await userModel.findByIdAndUpdate({_id:userId},{...userObj ,balance:checkUser.balance-amount, $inc:{order:1}},{new: true})
console.log(f,checkUser.balance)
return res.status(201).send({status:true , message : "create order", data:createOrder})

}catch(err){
  return res.status(500).send({status:false,message :err.message})
}

}