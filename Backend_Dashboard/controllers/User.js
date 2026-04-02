const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ GET ALL USERS
const getUsers = async (req, res) => {
	try {
		const users = await User.find().select("-password -refreshToken");
		res.json(users);
	} catch (err) {
		res.status(500).json(err.message);
	}
};

// ✅ CREATE USER
const createUser = async (req, res) => {
	try {
		const { username, email, password, role, isAdmin } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json("User already exists");
		}

		const hashedPwd = await bcrypt.hash(password, 10);
		const newUser = new User({
			username,
			email,
			password: hashedPwd,
			role:
				isAdmin || role === "admin" ? "admin"
				: role === "manager" ? "manager"
				: "support",
		});
		newUser.isAdmin = newUser.role === "admin";

		const savedUser = await newUser.save();
		const { password: _, refreshToken, ...userData } = savedUser._doc;
		res.status(201).json(userData);
	} catch (err) {
		res.status(500).json(err.message);
	}
};

// ✅ DELETE USER
const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedUser = await User.findByIdAndDelete(id);
		if (!deletedUser) {
			return res.status(404).json("User not found");
		}
		res.json({ message: "User deleted successfully" });
	} catch (err) {
		res.status(500).json(err.message);
	}
};

const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select(
			"-password -refreshToken",
		);
		res.json(user);
	} catch (err) {
		res.status(500).json(err);
	}
};

const updateUser = async (req, res) => {
	try {
		const updates = { ...req.body };

		if (updates.password) {
			updates.password = await bcrypt.hash(updates.password, 10);
		}

		if (
			updates.role &&
			!["admin", "manager", "support"].includes(updates.role)
		) {
			return res.status(400).json("Invalid role");
		}

		if (updates.role) {
			updates.isAdmin = updates.role === "admin";
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: updates,
			},
			{ new: true, projection: { password: 0, refreshToken: 0 } }, // return updated doc
		);

		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = { getUsers, deleteUser, createUser, getUserById, updateUser };
