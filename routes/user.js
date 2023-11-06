const express = require('express');
const router = express.Router();
const path = require('path');

const User = require('../models/user');

router.post('/addUser', (req, res, next) => {
    const reqBody = req.body;

    const user = new User({
        name: reqBody.name,
        email: reqBody.email,
        password: reqBody.password
    })

    user.save()
        .then(result => {
            res.status(200).json({
                message: "User Added Successfully",
                result: result
            })
        })
        .catch(err => {
            res.status(400).json({
                message: "User was not added",
                error: err
            })
        })
})

router.get('/getUsers', (req, res, next) => {
    User.find()
        .then((result) => {
            res.status(200).json({
                message: 'All User fetched successfully',
                result: result
            })
        })
        .catch((err) => {
            res.status(200).json({
                message: 'User not fetched',
                error: err
            })
        })
})

router.get('/getUserDetailsById/:id', (req, res) => {
    User.findById(req.params.id)
        .then((result) => {
            res.status(200).json({
                message: 'User details fetched successfully',
                result: result
            })
        })
        .catch((err) => {
            res.status(400).json({
                message: 'User not found',
                error: err
            })
        })
})

router.put('/updateUser/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
        .then((result) => {
            if (result) {
                res.status(200).json({
                    message: 'User updated successfully',
                    result: result
                });
            } else {
                res.status(404).json({
                    message: 'User not found'
                });
            }
        })
        .catch(err => {
            res.status(400).json({
                message: 'User was not updated',
                error: err
            })
        })
})

router.delete('/deleteUser/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id).then((result) => {
        if (result) {
            res.status(200).json({
                message: 'User deleted successfully',
                result: result
            })
        } else {
            res.status(404).json({
                message: 'User not found',
            })
        }
    })
        .catch(err => {
            res.status(400).json({
                message: 'User was not deleted',
                error: err
            })
        })
})

module.exports = router;