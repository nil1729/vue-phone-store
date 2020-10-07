const express = require("express");
const router = express.Router();
const {
	uniqueNamesGenerator,
	names
} = require("unique-names-generator");
const validator = require("validator");
const admin = require("../config/admin");
const verifyAuth = require("../middleware/auth");

router.get("/register", verifyAuth, async (req, res) => {
	try {
		if (req.token.name) {
			return res.status(200).json({
				msg: "Already Registered",
			});
		}
		const displayName = uniqueNamesGenerator({
			dictionaries: [names, names],
			length: 2,
			separator: " ",
			style: "capital",
		});
		const updatedUser = await admin.auth().updateUser(req.authID, {
			displayName,
			photoURL: "https://occtao.com/?qa=image&qa_blobid=10029442562307742919&qa_size=200",
		});
		const user = {
			details: {
				id: req.authID,
				...updatedUser.providerData[0],
				phoneNumber: null,
			},
			cart: [],
		};
		await admin.firestore().collection("users").doc(req.authID).set(user);
		return res.json({
			user: {
				...user,
				siteAdmin: req.siteAdmin,
			},
		});
	} catch (e) {
		console.log(e);
		return res.status(400).json({
			msg: "Invalid Credentials",
		});
	}
});

router.post("/google-register", verifyAuth, async (req, res) => {
	try {
		const user = {
			details: {
				id: req.authID,
				...req.body.user,
				phoneNumber: null,
			},
			cart: [],
		};
		await admin.firestore().collection("users").doc(req.authID).set(user);
		return res.json({
			user: {
				...user,
				siteAdmin: req.siteAdmin,
			},
		});
	} catch (e) {
		console.log(e);
		return res.status(400).json({
			msg: "Invalid Credentials",
		});
	}
});

router.get("/login", verifyAuth, async (req, res) => {
	try {
		const docSnap = await admin
			.firestore()
			.collection("users")
			.doc(req.authID)
			.get();
		return res.json({
			user: {
				...docSnap.data(),
				siteAdmin: req.siteAdmin,
			},
		});
	} catch (e) {
		console.log(e);
		return res.status(400).json({
			msg: "Invalid Credentials",
		});
	}
});

router.post("/update-profile-details", verifyAuth, async (req, res) => {
	try {
		let {
			displayName,
			phoneNumber
		} = req.body;
		let user;
		if (displayName) {
			let words = displayName.split(" ");
			words.forEach((word) => {
				if (word.trim().length !== 0 && !validator.isAlpha(word)) {
					return res.status(400).json({
						msg: "Display Name is not valid",
					});
				}
			});
		}
		if (phoneNumber && !validator.isMobilePhone(phoneNumber)) {
			return res.status(400).json({
				msg: "Phone Number is not valid",
			});
		}
		if (phoneNumber && displayName) {
			user = await admin.auth().updateUser(req.authID, {
				displayName,
			});
			await admin.firestore().collection("users").doc(req.authID).update({
				"details.displayName": displayName,
				"details.phoneNumber": phoneNumber,
			});
		} else if (displayName) {
			await admin.firestore().collection("users").doc(req.authID).update({
				"details.displayName": displayName,
			});
		} else if (phoneNumber) {
			await admin.firestore().collection("users").doc(req.authID).update({
				"details.phoneNumber": phoneNumber,
			});
		} else {
			return res.status(400).json({
				msg: "No Data Provided",
			});
		}
		return res.status(200).json({
			msg: "Profile Updated Succesfully",
		});
	} catch (e) {
		console.log(e);
		return res.status(400).json({
			msg: "Invalid Credentials",
		});
	}
});

module.exports = router;