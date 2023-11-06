const mongodb = require('mongodb');
const mongoose = require('mongoose');

const mongodbConnection = (callback) => {
    mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.zoplvz8.mongodb.net/?retryWrites=true&w=majority`)
    .then((client) => {
        console.log("Database connection successful");
        callback(client);
    })
    .catch(err => {
        console.log(err)
    })
}

module.exports = mongodbConnection;