const express = require('express')
const mongoose = require('mongoose')
const router = require("./route/route")
mongoose.set('strictQuery', true)

const app = express()
app.use(express.json())


mongoose.connect("mongodb+srv://shyamgupta:.T!8NRrzf6FyMYc@cluster0.dbdyccj.mongodb.net/orderManagement")
.then(() => console.log("mongoDB is connected"))
.catch((error) => console.error(error.message))


app.use('/', router)

app.listen(3000, () => {
      console.log("Express app running on port " + 3000)
})