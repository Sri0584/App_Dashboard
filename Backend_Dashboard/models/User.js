const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: String,
		email: String,
		password: String,
		isAdmin: { type: Boolean, default: false },
		role: {
			type: String,
			enum: ["admin", "manager", "support"],
			default: "support",
		},
		refreshToken: { type: String, default: null, select: false },
		profilePic: String,
	},
	{ timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
