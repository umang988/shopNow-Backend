const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const cloudinary = require('./util/cloudinary');

const mongodbConnection = require('./util/database');

const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const imageUploadRoutes = require('./routes/imageUpload');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cors());
app.use('/images',express.static(path.join(__dirname,"images/")));  

app.use('/api/shop',shopRoutes);
app.use('/api/product', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/image', imageUploadRoutes);

mongodbConnection(client => {
    app.listen(3000);
})


