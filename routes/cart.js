const express = require('express');
const router = express.Router();
const path = require('path');

const Cart = require('../models/cart');

router.post('/addCart', async (req, res, next) => {
    try {
        const reqBody = req.body;
        const cart = new Cart();

        const item = {
            product: reqBody.productId,
            quantity: 1
        };

        cart.items.push(item);
        cart.user = reqBody.userId;

        // Use await to ensure 'populate' is resolved before continuing
        await cart.populate({
            path: 'items.product',
            model: 'Product'
        });

        console.log(cart.items[0].product);

        // Ensure 'cart.amount', 'cart.convenienceFee', and 'cart.deliveryFee' are defined properly
        cart.amount = cart.items[0].product.price;

        // Calculate 'cart.totalAmount' after setting all required properties
        cart.totalAmount = cart.amount + cart.convenienceFee + cart.deliveryFee;

        // Use async/await to handle the 'save' operation
        const savedCart = await cart.save();

        // Use 'populate' to populate the 'user' field in the result
        const populatedResult = await savedCart.populate('user');
        console.log(populatedResult)

        res.status(200).json({
            message: "Cart Added Successfully",
            result: populatedResult
        });
    } catch (err) {
        res.status(400).json({
            message: "Cart was not added",
            error: err
        });
    }
});

router.post('/addNewItem/:cartId', async (req, res, next) => {
    try {
        const reqBody = req.body;
        const item = {
            product: reqBody.productId,
            quantity: 1
        };

        const cart = await Cart.findById(req.params.cartId);

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        cart.items.push(item);

        await cart.populate({
            path: 'items.product',
            model: 'Product'
        });

        // Calculate the updated 'amount' (sum of product prices)
        const updatedAmount = cart.items.reduce((total, cartItem) => {
            const productPrice = cartItem.product.price;
            const quantity = cartItem.quantity;
            return total + (productPrice * quantity);
        }, 0);

        // Set the updated 'amount'
        cart.amount = updatedAmount;

        // Calculate the 'totalAmount' (including any fees)
        const updatedTotalAmount = cart.amount + cart.convenienceFee + cart.deliveryFee;

        // Set the updated 'totalAmount'
        cart.totalAmount = updatedTotalAmount;

        // Save the updated cart
        const updatedCart = await cart.save();

        res.status(200).json({
            message: 'New Item added successfully',
            result: updatedCart
        });
    } catch (err) {
        res.status(400).json({
            message: 'Item was not added',
            error: err
        });
    }
});

router.get('/getCartDetailsById/:id', (req, res) => {
    Cart.findById(req.params.id)
        .populate({
            path: 'items.product',
            model: 'Product'
        })
        .populate(['user',])
        .then((result) => {
            res.status(200).json({
                message: 'Cart details fetched successfully',
                result: result
            })
        })
        .catch((err) => {
            res.status(400).json({
                message: 'Cart not found',
                error: err
            })
        })
})

router.get('/getCartDetailsByUserId/:userId', (req, res) => {
    console.log('hello')
    Cart.findOne({ user: req.params.userId })
        .populate({
            path: 'items.product',
            model: 'Product'
        })
        .populate(['user'])
        .then((result) => {
            res.status(200).json({
                message: 'Cart details fetched successfully',
                result: result
            })
        })
        .catch((err) => {
            res.status(400).json({
                message: 'Cart not found',
                error: err
            })
        })
})

router.put('/updateCart/:id', async (req, res) => {
    try {
        const cartId = req.params.id;
        const updatedItems = req.body.items;

        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        if (!updatedItems || updatedItems.length === 0) {
            await Cart.deleteOne({ _id: cartId });
            return res.status(200).json({
                message: 'Cart deleted successfully',
                result: {}
            });
        }

        // Update the cart's items
        cart.items = updatedItems;
        console.log(cart);

        await cart.populate({
            path: 'items.product',
            model: 'Product'
        });
        console.log(cart);

        // Calculate the updated 'amount' based on the new items
        const updatedAmount = updatedItems.reduce((total, cartItem) => {
            const productPrice = cartItem.product.price;
            const quantity = cartItem.quantity;
            console.log(quantity);
            return total + (productPrice * quantity);
        }, 0);

        // Set the updated 'amount'
        cart.amount = updatedAmount;

        // Calculate the 'totalAmount' (including any fees)
        const updatedTotalAmount = cart.amount + cart.convenienceFee + cart.deliveryFee;

        // Set the updated 'totalAmount'
        cart.totalAmount = updatedTotalAmount;

        // Save the updated cart
        const updatedCart = await cart.save();

        res.status(200).json({
            message: 'Cart updated successfully',
            result: updatedCart
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({
            message: 'Cart was not updated',
            error: err.message
        });
    }
});

router.delete('/deleteCart/:id', (req, res) => {
    Cart.findByIdAndDelete(req.params.id).then((result) => {
        res.status(200).json({
            message: 'Cart deleted successfully',
            result: result
        })
    })
        .catch(err => {
            res.status(400).json({
                message: 'Cart was not deleted',
                error: err
            })
        })
})

module.exports = router;