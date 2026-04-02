const {
	getUsers,
	deleteUser,
	createUser,
	getUserById,
	updateUser,
} = require("../controllers/User");
const {
	verifyToken,
	authorizeRoles,
	authorizeSelfOrRoles,
} = require("../middleware/authMiddleware");

const router = require("express").Router();

//get users
router.get("/", verifyToken, authorizeRoles("admin", "manager"), getUsers);
router.post("/", verifyToken, authorizeRoles("admin"), createUser);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser);
router.get(
	"/:id",
	verifyToken,
	authorizeSelfOrRoles("admin", "manager"),
	getUserById,
);
// UPDATE USER ✅
router.put(
	"/:id",
	verifyToken,
	authorizeSelfOrRoles("admin", "manager"),
	updateUser,
);

module.exports = router;
