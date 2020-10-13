const express = require("express");
const router = express.Router();
const validator = require("validator");
const admin = require("../config/admin");
const verifyAuth = require("../middleware/auth");
const payPalClient = require('../config/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const Order = require('../models/Order');


router.get('/checkout', verifyAuth, async (req, res) => {
    try {
        const userDoc = await admin.firestore().collection("users").doc(req.authID).get();
        let total = 0;
        if (userDoc.exists) {
            let cartItems = [];
            userDoc.data().cart.forEach(item => {
                total += (item.price * item.quantity);
                cartItems.push(item);
            });
            total += (total * 0.05);

            let order = await Order.findOne({
                user: req.authID
            });

            if (!order || (order && order.isPurchased)) {
                order = await Order.create({
                    user: req.authID,
                    products: cartItems,
                    amount: parseFloat(total.toFixed(2)),
                });
            } else {
                await Order.updateOne({
                    _id: order._id
                }, {
                    $set: {
                        products: cartItems,
                        amount: parseFloat(total.toFixed(2))
                    }
                });
            }

            return res.json({
                description: `Phone Store Products - ${req.authID} -  ${order._id}`,
                amount: {
                    currency_code: 'INR',
                    value: parseFloat(total.toFixed(2))
                }
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            msg: "Server Error",
        });
    }
});



// Verify the Order
router.post('/checkout/verify-order', verifyAuth, async (req, res) => {
    try {
        const {
            orderID,
            orderStaticId
        } = req.body;

        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);

        request.requestBody({});

        const captureDoc = await payPalClient.client().execute(request);

        const capture = captureDoc.result;

        if (capture.status === 'COMPLETED') {
            await Order.updateOne({
                _id: orderStaticId
            }, {
                $set: {
                    isPurchased: true,
                    orderID: capture.captureResult.id,
                    captureID: capture.purchase_units[0].payments.captures[0].id,
                    shippingAddress: capture.purchase_units[0].shipping.address,
                }
            });
            return res.json({
                msg: 'Successful purchased',
                captureID: capture.purchase_units[0].payments.captures[0].id
            });
        }
        return res.status(400).json({
            msg: 'Invalid Request or Data you are requesting is not valid',
        });
    } catch (err) {
        return res.status(err.statusCode).json({
            error: JSON.parse(err.message)
        });
    }
});


module.exports = router;