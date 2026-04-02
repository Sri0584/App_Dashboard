const sendMail = require("../controllers/Mail");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/", verifyToken, authorizeRoles("admin", "manager"), sendMail);
module.exports = router;
