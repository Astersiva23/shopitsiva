import express from 'express';
import { deleteProductDetails,
    updateProductDetails,
    getProductDetails,
    getProducts,
    newProducts } from '../controllers/productControllers.js';
import { authorizeRoles, isAuthentictedUser } from '../middlewares/authh.js';
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(isAuthentictedUser,authorizeRoles('admin'),newProducts);

router.route("/products/:id").get(getProductDetails);

router.route("/admin/products/:id").put(isAuthentictedUser,authorizeRoles('admin'),updateProductDetails);
router.route("/admin/products/:id").delete(isAuthentictedUser,authorizeRoles('admin'),deleteProductDetails);
export default router;

