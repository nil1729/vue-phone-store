const express = require('express');
const router = express.Router();
const verifyAuth = require('../middleware/auth');

//TODO Just for Testing
const { products } = require('../data');

router.get('/products', verifyAuth, async (req, res) => {
	try {
		if (!req.authID) {
			return res.status(400).json({
				msg: 'Invalid Credentials',
			});
		}
		return res.json({
			products,
		});
	} catch (e) {
		return res.status(500).json({
			msg: 'Server error',
		});
	}
});

module.exports = router;
