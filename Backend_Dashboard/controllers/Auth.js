const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
	getRefreshCookieOptions,
	resolveUserRole,
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
} = require("../utils/authTokens");
const { parseCookies } = require("../utils/cookies");

const normalizeRole = ({ isAdmin, role }) => {
	if (isAdmin || role === "admin") {
		return "admin";
	}

	if (role === "manager") {
		return "manager";
	}

	return "support";
};

const sanitizeUser = (user) => {
	const userObject = user.toObject ? user.toObject() : user._doc;
	const role = resolveUserRole(userObject);
	const { password, refreshToken, ...safeUser } = userObject;

	return {
		...safeUser,
		role,
		isAdmin: role === "admin",
	};
};

const setRefreshCookie = (res, refreshToken) => {
	const options = getRefreshCookieOptions();
	res.cookie("refreshToken", refreshToken, options);
};

const clearRefreshCookie = (res) => {
	res.clearCookie("refreshToken", getRefreshCookieOptions());
};

const registerUser = async (req, res) => {
	const { username, email, password, role, isAdmin } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json("User already exists");
		}

		const hashedPwd = await bcrypt.hash(password, 10);

		const newUser = new User({
			username,
			email,
			password: hashedPwd,
			role: normalizeRole({ role, isAdmin }),
		});
		newUser.isAdmin = newUser.role === "admin";

		const savedUser = await newUser.save();

		res.status(201).json(sanitizeUser(savedUser));
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email }).select("+refreshToken");
		if (!user) {
			return res.status(401).json("User not found!");
		}

		const validPwd = await bcrypt.compare(password, user.password);

		if (!validPwd) {
			return res.status(401).json("Wrong password!");
		}

		const accessToken = signAccessToken(user);
		const refreshToken = signRefreshToken(user);

		user.refreshToken = await bcrypt.hash(refreshToken, 10);
		await user.save();
		setRefreshCookie(res, refreshToken);
		res.status(200).json({
			...sanitizeUser(user),
			accessToken,
		});
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const refreshAccessToken = async (req, res) => {
	const cookies = parseCookies(req.headers.cookie);
	const refreshToken = cookies.refreshToken || req.body?.refreshToken;

	if (!refreshToken) {
		return res.status(401).json("Refresh token is required");
	}

	try {
		const payload = verifyRefreshToken(refreshToken);
		const user = await User.findById(payload.id).select("+refreshToken");

		if (!user || !user.refreshToken) {
			clearRefreshCookie(res);
			return res.status(401).json("Refresh token is invalid");
		}

		const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

		if (!tokenMatches) {
			clearRefreshCookie(res);
			return res.status(401).json("Refresh token is invalid");
		}

		const accessToken = signAccessToken(user);
		const nextRefreshToken = signRefreshToken(user);

		user.refreshToken = await bcrypt.hash(nextRefreshToken, 10);
		await user.save();

		setRefreshCookie(res, nextRefreshToken);

		return res.status(200).json({
			accessToken,
			user: sanitizeUser(user),
		});
	} catch (error) {
		clearRefreshCookie(res);
		return res.status(401).json("Refresh token expired or invalid");
	}
};

const logoutUser = async (req, res) => {
	const cookies = parseCookies(req.headers.cookie);
	const refreshToken = cookies.refreshToken || req.body?.refreshToken;

	try {
		if (refreshToken) {
			const decoded = jwt.decode(refreshToken);

			if (decoded?.id) {
				await User.findByIdAndUpdate(decoded.id, {
					$set: { refreshToken: null },
				});
			}
		}

		clearRefreshCookie(res);
		return res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		clearRefreshCookie(res);
		return res.status(500).json(error.message);
	}
};

module.exports = {
	loginUser,
	logoutUser,
	refreshAccessToken,
	registerUser,
};
