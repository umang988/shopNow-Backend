const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({
                message: "Email does not exist...!"
            });
        }

        const result = await bcrypt.compare(req.body.password, user.password);

        if (!result) {
            return res.status(400).json({
                message: "Password is Incorrect"
            });
        }

        const payload = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            address: user.address,
            roleId: user.roleId,
            active: user.active,
        };

        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1h' });
        payload.token = token;
        payload.expiresIn = 3600;

        return res.status(200).json({
            message: 'Login Successful',
            result: payload,
        });
    } catch (err) {
        return res.status(401).json({
            message: "Email or Password is incorrect",
            error: err
        });
    }
});

router.post('/signup', async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
        });

        const result = await user.save();

        return res.status(200).json({
            message: "Account created successfully",
            result: result
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                message: "Email ID already exists",
                error: err
            });
        }

        return res.status(400).json({
            message: "There is some error in password",
            error: err
        });
    }
});

module.exports = router;
