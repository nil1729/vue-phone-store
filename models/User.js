const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    cart: {
        type: 'array',
        default: [],
    },
    details: {
        type: 'object',
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);