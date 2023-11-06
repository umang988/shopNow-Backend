const express = require('express');
const router = express.Router();
const path = require('path');

const Product = require('../models/product');

router.post('/addProduct', (req, res, next) => {
    const reqBody = req.body;

    const product = new Product({
        name: reqBody.name,
        price: reqBody.price,
        description: reqBody.description,
        gender: reqBody.gender,
        category : reqBody.category,
        subCategory: reqBody.subCategory,
        image: reqBody.image
    })

    product.save()
        .then(result => {
            res.status(200).json({
                message: "Product Added Successfully",
                result: result
            })
        })
        .catch(err => {
            res.status(400).json({
                message: "Product was not added",
                error: err
            })
        })
})

router.get('/getProducts', async (req, res, next) => {
    try {
        const gender = req.query.gender;
        console.log(gender)
        const filter = gender ? { gender } : {};

        const result = await Product.find(filter);

        if (result.length === 0) {
            return res.status(404).json({
                message: 'No products found for the specified gender'
            });
        }

        res.status(200).json({
            message: 'Products fetched successfully',
            result: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching products',
            error: err.message
        });
    }
});

router.get('/getProductDetailsById/:id', (req, res) => {
    console.log('hello')
    Product.findById(req.params.id)
        .then((result) => {
            res.status(200).json({
                message: 'Product details fetched successfully',
                result: result
            })
        })
        .catch((err) => {
            res.status(400).json({
                message: 'Product not found',
                error: err
            })
        })
})

router.put('/updateProduct/:id', (req, res) => {
    Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image
    }).then((result) => {
        res.status(200).json({
            message: 'Product updated successfully',
            result: result
        })
    })
        .catch(err => {
            res.status(400).json({
                message: 'Product was not updated',
                error: err
            })
        })
})

router.delete('/deleteProduct/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id).then((result) => {
        res.status(200).json({
            message: 'Product deleted successfully',
            result: result
        })
    })
        .catch(err => {
            res.status(400).json({
                message: 'Product was not deleted',
                error: err
            })
        })
})

module.exports = router;