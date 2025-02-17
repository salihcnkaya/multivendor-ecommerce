import express from 'express';
import {
	createProduct,
	deleteProduct,
	getProductDetails,
	getProducts,
	searchProduct,
	// getVendorProducts,
} from '../controllers/productController.js';
import { authorize, protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', searchProduct);
router.get('/', getProducts);
router.get('/:slug', getProductDetails);
router.delete('/:slug', protectRoute, authorize('vendor'), deleteProduct);
router.post('/', protectRoute, authorize('vendor'), createProduct);

export default router;
