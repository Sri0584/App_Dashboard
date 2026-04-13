const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || "7d";

const getAccessSecret = () =>
	process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;

const getRefreshSecret = () =>
	process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;

const resolveUserRole = (user) => {
	if (user?.role) {
		return user.role;
	}

	return user?.isAdmin ? "admin" : "support";
};

const buildTokenPayload = (user) => {
	const role = resolveUserRole(user);

	return {
		id: String(user._id),
		email: user.email,
		role,
		isAdmin: role === "admin",
	};
};

const signAccessToken = (user) =>
	jwt.sign(buildTokenPayload(user), getAccessSecret(), {
		expiresIn: ACCESS_TOKEN_TTL,
	});

const signRefreshToken = (user) =>
	jwt.sign(buildTokenPayload(user), getRefreshSecret(), {
		expiresIn: REFRESH_TOKEN_TTL,
	});

const verifyAccessToken = (token) => jwt.verify(token, getAccessSecret());

const verifyRefreshToken = (token) => jwt.verify(token, getRefreshSecret());

const getRefreshCookieOptions = () => ({
	httpOnly: true,
	sameSite: "lax",
	secure: false, // Disable secure for development (HTTP)
	path: "/", // Allow cookie for all routes
	maxAge: 7 * 24 * 60 * 60 * 1000,
	domain:
		process.env.NODE_ENV === "production" ?
			"app-dashboard-api-c4gvdch3fvgcgtcz.westeurope-01.azurewebsites.net"
		:	"localhost", // Set domain for localhost in development
});

module.exports = {
	buildTokenPayload,
	getRefreshCookieOptions,
	resolveUserRole,
	signAccessToken,
	signRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
};
