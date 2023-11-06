const express = require('express');
const router = express.Router();
const multer = require('../util/fileupload');
const cloudinary = require('../util/cloudinary');
const fs = require('fs');

router.get('/test', (req, res) => {
    res.send('Working');
});

router.post('/uploadImages', multer.array('image'), async (req, res) => {
    try {
        const files = req.files;
        const imageUrls = [];

        for (const file of files) {
            const result = await uploadToCloudinary(file);
            if (result.secure_url) {
                imageUrls.push(result.secure_url);
            } else {
                throw new Error('Image upload failed');
            }
        }

        console.log('Image URLs:', imageUrls);
        res.status(200).json({ 
            message: 'Images uploaded successfully', 
            images : imageUrls 
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ error: 'Image upload failed' });
    }
});

const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = router;
