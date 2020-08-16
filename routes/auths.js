const express = require('express');
const router = express.Router();
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const admin = require('../config/admin');

router.post('/login', async (req, res) => {
	try {
		const decodedToken = await admin.auth().verifyIdToken(req.body.idToken);
		const displayName = uniqueNamesGenerator({
			dictionaries: [names, names],
			length: 2,
			separator: ' ',
			style: 'capital',
		});
		const updatedUser = await admin.auth().updateUser(decodedToken.uid, {
			displayName,
			photoURL:
				'https://occtao.com/?qa=image&qa_blobid=10029442562307742919&qa_size=200',
		});
		return res.json({
			user: { id: decodedToken.uid, ...updatedUser.providerData[0] },
		});
	} catch (e) {
		console.log(e);
		return res.status(400).json({
			msg: 'Invalid Credentials',
		});
	}
});

module.exports = router;
