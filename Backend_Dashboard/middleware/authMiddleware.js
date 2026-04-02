const { verifyAccessToken } = require("../utils/authTokens");

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.token;

	if (!authHeader) {
		return res.status(401).json("Not authenticated!");
	}

	const token = authHeader.split(" ")[1];

	try {
		req.user = verifyAccessToken(token);
		return next();
	} catch (error) {
		return res.status(401).json("Invalid token!");
	}
};

const authorizeRoles =
	(...roles) =>
	(req, res, next) => {
		if (!req.user) {
			return res.status(401).json("Not authenticated!");
		}

		if (!roles.includes(req.user.role)) {
			return res
				.status(403)
				.json("You are not allowed to access this resource");
		}

		return next();
	};

const authorizeSelfOrRoles =
	(...roles) =>
	(req, res, next) => {
		if (!req.user) {
			return res.status(401).json("Not authenticated!");
		}

		if (req.user.id === req.params.id || roles.includes(req.user.role)) {
			return next();
		}

		return res.status(403).json("You are not allowed to access this resource");
	};

module.exports = {
	authorizeRoles,
	authorizeSelfOrRoles,
	verifyToken,
};
