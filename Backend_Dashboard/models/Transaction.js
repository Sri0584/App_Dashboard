const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
	{
		customer: {
			type: String,
			required: true,
		},

		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},

		amount: {
			type: Number,
			required: true,
		},

		status: {
			type: String,
			enum: ["Approved", "Pending", "Declined"],
			default: "Pending",
		},

		method: {
			type: String,
			default: "Card", // Card, Cash, UPI, etc.
		},

		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},

		profilePic: {
			type: String,
			default: "/placeholder.svg",
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
