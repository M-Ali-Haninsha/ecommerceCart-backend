const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
        type:String
    },
    productPrice: {
        type: Number
    },
    description: {
        type: String
    },
    quantity:{
        type: Number
    },
    imageUrl: {
        type: String
    }
})

const productData = mongoose.model('productData', productSchema)
module.exports = productData