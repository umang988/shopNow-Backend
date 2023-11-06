const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1, required: true },
})

const cartSchema = new Schema({
    items: { type: [cartItemSchema] },
    amount: { type: Number, require: true },
    convenienceFee: { type: Number, default: 20, require: true },
    deliveryFee: { type: Number, default: 40, require: true },
    totalAmount: { type: Number, require: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Cart', cartSchema);