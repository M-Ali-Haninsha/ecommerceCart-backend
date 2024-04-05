const cartModel = require('../Models/cart')
const productModel = require('../Models/productModel')

const jwt = require("jsonwebtoken");
const secretKey = "your-secret-key";

const addToCart = async(req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        const decoded = jwt.verify(token, secretKey);
        let userId = decoded.value._id;

        let existingCart = await cartModel.findOne({ user: userId });

    if (!existingCart) {
        const newCart = new cartModel({
            user: userId,
            products: [{
                productId: req.body.productId,
                quantity: 1 
            }]
        });
        existingCart = await newCart.save();
    } else {
        let existingProduct = existingCart.products.find(product => product.productId.toString() === req.body.productId.toString());
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        existingCart.products.push({
            productId: req.body.productId,
            quantity: 1
        });
    }

    existingCart = await existingCart.save();
    }

    res.status(201).json(existingCart); 

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

    const getCartItems = async(req, res)=> {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1];
            const decoded = jwt.verify(token, secretKey);
            let userId = decoded.value._id;
            console.log('user id',userId);

            let userItems = await cartModel.findOne({user: userId}).populate("products.productId")
            console.log(userItems);
            res.status(200).json(userItems)

        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    const getCartItemLocalStorage = async(req, res) => {
        try {
            let { product } = req.query
            const productData = JSON.parse(product);
            console.log(productData);
            const foundProducts = [];

    for (const entry of productData) {
      const { productId, quantity } = entry;

      const foundProduct = await productModel.findById(productId);

      if (foundProduct) {
        foundProducts.push({ product: foundProduct, quantity });
      }
    }
    res.json({ products: foundProducts });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    const getCartItemLocalAndToken = async(req, res) => {
        try {
            const productData = JSON.parse(req.query.product);

            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1];
            const decoded = jwt.verify(token, secretKey);
            let userId = decoded.value._id;

            let userCart = await cartModel.findOne({user: userId})
            if (!userCart) {
                userCart = new cartModel({
                    user: userId,
                    products: []
                });
            }

            for (const productItem of productData) {
                const { productId, quantity } = productItem;
        
                const existingProduct = userCart.products.find(p => p.productId.toString() === productId);
        
                if (existingProduct) {
                    existingProduct.quantity += quantity;
                } else {
                    userCart.products.push({
                        productId,
                        quantity
                    });
                }
            }
        
            await userCart.save();
            
            let userItems = await cartModel.findOne({user: userId}).populate("products.productId")
            console.log('final',userItems);
            res.status(200).json(userItems);

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    const incrementDecrement = async(req, res)=> {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1];
            const decoded = jwt.verify(token, secretKey);
            let userId = decoded.value._id;

            if(req.body.value == 'increment') {
                const incremented = await cartModel.findOneAndUpdate(
                    { user: userId, 'products.productId': req.body.proId },
                    { $inc: { 'products.$.quantity': 1 } },
                    { new: true }
                );
    
                if (!incremented) {
                    return res.status(404).send('Cart not found');
                } else {
                    res.status(200).json({incremented:'success'})
                }
                } else {
                if (req.body.currentQuantity === 1) {
                    return res.status(400).send('Minimum quantity reached');
                }
                const decremented = await cartModel.findOneAndUpdate(
                    { user: userId, 'products.productId': req.body.productId },
                    { $inc: { 'products.$.quantity': -1 } },
                    { new: true }
                );

                if (!decremented) {
                    return res.status(404).send('Cart not found');
                } else {
                    res.status(200).json({decremented:'success'})
                }
            }
            
            
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    const removeItem = async(req, res)=> {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1];
            const decoded = jwt.verify(token, secretKey);
            let userId = decoded.value._id;

             await cartModel.findOneAndUpdate(
        { user: userId },
        { $pull: { products: { productId: req.body.productId } } },
        { new: true }
    );
    res.status(200).send({removed:'success'});
                
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' })
        }
    }

module.exports = {
    addToCart,
    getCartItems,
    getCartItemLocalStorage,
    getCartItemLocalAndToken,
    incrementDecrement,
    removeItem
}