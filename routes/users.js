const express = require('express');
const jwt = require('../middleware/jwt')

const productController = require('../controller/productController')
const userController = require('../controller/userController')
const cartController = require('../controller/cartController')
const router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource here');
});

router.get('/getProducts', productController.getProduct)
router.get('/getCartItems', jwt, cartController.getCartItems)
router.get('/getLocalStorageProduct', cartController.getCartItemLocalStorage)
router.get('/getCartItemIfLocalData', cartController.getCartItemLocalAndToken)

router.post('/userSignup', userController.userSignup)
router.post('/userLogin', userController.userLogin)
router.post('/addToCart', jwt,cartController.addToCart)
router.post('/incrementOrDecrement', jwt, cartController.incrementDecrement)
router.post('/removeCartItem', jwt, cartController.removeItem)


module.exports = router;
