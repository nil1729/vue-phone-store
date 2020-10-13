const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    user: {
        type: String,
        required: true
    },
    isPurchased: {
        type: Boolean,
        required: true,
        default: false,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    shippingAddress: {
        type: "object",
    },
    amount: {
        type: Number,
        required: true,
    },
    orderID: {
        type: String,
    },
    captureID: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", OrderSchema);