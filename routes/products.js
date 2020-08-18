const express = require('express');
const router = express.Router();
const verifyAuth = require('../middleware/auth');
const admin = require('../config/admin');
const paginate = require('../middleware/paginate');

//TODO Just for Testing
const { products } = require('../data');

router.get('/products', [verifyAuth, paginate(products)], async (req, res) => {
	try {
		if (!req.authID) {
			return res.status(400).json({
				msg: 'Invalid Credentials',
			});
		}
		return res.json({
			products: req.paginatedResults,
		});
	} catch (e) {
		return res.status(500).json({
			msg: 'Server error',
		});
	}
});

router.post('/save-cart', verifyAuth, async (req, res) => {
	try {
		await admin.firestore().collection('users').doc(req.authID).set(
			{
				cart: req.body.cart,
			},
			{ merge: true }
		);
		return res.status(200).json({
			msg: 'Cart items Saved',
		});
	} catch (e) {
		return res.status(500).json({
			msg: 'Server error',
		});
	}
});

module.exports = router;
