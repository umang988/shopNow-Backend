const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique : true},
    password: { type: String },
    address: { type: String },
    roleId: { type: String, required: true, default : 3 },
    active: { type : Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);