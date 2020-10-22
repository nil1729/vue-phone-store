const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
	{
		model: {
			type: String,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		photoURL: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		reviews: [
			{
				name: String,
				comment: String,
				stars: Number
			}
		]
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
