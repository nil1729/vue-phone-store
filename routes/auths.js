const express = require('express');
const router = express.Router();
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const admin = require('../config/admin');
const verifyAuth = require('../middleware/auth');

router.get('/register', verifyAuth, async (req, res) => {
	try {
		if (req.token.name) {
			return res.status(200).json({
				msg: 'Already Registered',
			});
		}
		const displayName = uniqueNamesGenerator({
			dictionaries: [names, names],
			length: 2,
			separator: ' ',
			style: 'capital',
		});
		const updatedUser = await admin.auth().updateUser(req.authID, {
			displayName,
			photoURL:
				'https://occtao.com/?qa=image&qa_blobid=10029442562307742919&qa_size=200',
		});
		const user = {
			details: {
				id: req.authID,
				...updatedUser.providerData[0],
				phoneNumber: null,
			},
			cart: [],
		};
		await admin.firestore().collection('users').doc(req.authID).set(user);
		return res.json({
			user,
		});
	} catch (e) {
		console.log(e);
		return res.status(400).json({
			msg: 'Invalid Credentials',
		});
	}
});

router.get('/login', verifyAuth, async (req, res) => {
	try {
		const docSnap = await admin
			.firestore()
			.collection('users')
			.doc(req.authID)
			.get();
		return res.json({
			user: docSnap.data(),
		});
	} catch (e) {
		console.log(e);
		return res.status(400).json({
			msg: 'Invalid Credentials',
		});
	}
});

module.exports = router;
