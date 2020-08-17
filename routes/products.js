const express = require('express');
const router = express.Router();
const verifyAuth = require('../middleware/auth');

router.get('/products', verifyAuth, async (req, res) => {
	try {
		return res.json({
			msg: req.authID,
		});
	} catch (e) {
		return res.status(500).json({
			msg: 'Server error',
		});
	}
});

module.exports = router;
