const productModel = require('../Models/productModel')

const getProduct = async(req, res) => {
    try{
        const products = await productModel.find()
        res.status(200).json(products)
    }catch(err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = {
    getProduct
}