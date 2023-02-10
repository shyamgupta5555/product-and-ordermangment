const router = require('express')()

const {createOrder,createUser,createProduct} = require('../controller/controller')

router.post('/register',createUser)
router.post('/products',createProduct)
router.post('/order',createOrder)



module.exports =router