const {
	createProduct,
	getProducts,
	updateProduct,
	getProductById,
	deleteProduct,
} = require("../controllers/Product");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = require("express").Router();

//CREATE
router.post("/", verifyToken, authorizeRoles("admin", "manager"), createProduct);

//GET
router.get("/", getProducts);
router.get("/:id", getProductById);

router.put("/:id", verifyToken, authorizeRoles("admin", "manager"), updateProduct);
router.delete(
	"/:id",
	verifyToken,
	authorizeRoles("admin", "manager"),
	deleteProduct,
);

module.exports = router;
