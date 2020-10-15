const express = require('express');
const router = express.Router();
const verifyAuth = require('../middleware/auth');
const admin = require('../config/admin');
const paginate = require('../middleware/paginate');
const Product = require('../models/Product');
const User = require('../models/User');


router.get('/products', [verifyAuth, paginate(Product)], async (req, res) => {
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
		await User.updateOne({
			'details.id': req.authID
		}, {
			$set: {
				cart: req.body.cart
			}
		});
		return res.status(200).json({
			msg: 'Cart items Saved',
		});
	} catch (e) {
		return res.status(500).json({
			msg: 'Server error',
		});
	}
});

router.post('/admin/add-product', verifyAuth, async (req, res) => {
	try {
		if (!req.siteAdmin) {
			return res.status(403).json({
				msg: 'Unauthorized Access',
			});
		}
		await Product.create(req.body);
		return res.json({
			code: 'Server Notification',
			message: 'Product Details Uploaded Successfully',
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: 'Server error',
		});
	}
});

router.get('/view/product/:id', verifyAuth, async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		res.json({
			product,
		});
	} catch (e) {
		return res.status(500).json({
			msg: 'Server error',
		});
	}
});

module.exports = router;