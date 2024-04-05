const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userData',
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'productData',
        },
        quantity:{
        type:Number,
        },
    }],
}) 

const cart=mongoose.model('carts', cartSchema);

module.exports = cart;