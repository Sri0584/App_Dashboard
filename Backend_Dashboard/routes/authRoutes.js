const router = require("express").Router();
const {
	registerUser,
	loginUser,
	refreshAccessToken,
	logoutUser,
} = require("../controllers/Auth");

router.post("/register", registerUser);

router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

// Test route to check cookies
router.get("/cookies", (req, res) => {
	const { parseCookies } = require("../utils/cookies");
	const cookies = parseCookies(req.headers.cookie);
	console.log("Cookie test - Raw header:", req.headers.cookie);
	console.log("Cookie test - Parsed cookies:", cookies);
	res.json({
		rawCookieHeader: req.headers.cookie,
		parsedCookies: cookies,
		refreshToken: cookies.refreshToken ? "present" : "missing"
	});
});

module.exports = router;
