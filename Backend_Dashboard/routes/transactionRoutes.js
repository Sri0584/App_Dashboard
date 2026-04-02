const router = require("express").Router();
const {
	createTransaction,
	getTransactions,
} = require("../controllers/Transaction");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// CREATE
router.post(
	"/",
	verifyToken,
	authorizeRoles("admin", "manager"),
	createTransaction,
);

// GET ALL
router.get(
	"/",
	verifyToken,
	authorizeRoles("admin", "manager", "support"),
	getTransactions,
);

module.exports = router;
