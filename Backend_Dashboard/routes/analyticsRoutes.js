const { getUsers, getAllUsers } = require("../controllers/Analytics");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = require("express").Router();
//get users
router.get("/", verifyToken, authorizeRoles("admin", "manager"), getUsers);

router.get("/users", verifyToken, authorizeRoles("admin", "manager"), getAllUsers);

module.exports = router;
