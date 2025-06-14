import express from 'express';
import {
	createProduct,
	deleteProduct,
	getProductDetails,
	getProducts,
	searchProduct,
	updateProduct,
} from '../controllers/productController.js';
import { authorize, protectRoute } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/search', searchProduct);
router.get('/', getProducts);
router.get('/:slug', getProductDetails);
router.delete('/:slug', protectRoute, authorize('vendor'), deleteProduct);
router.post(
	'/',
	protectRoute,
	authorize('vendor'),
	upload.array('images'),
	createProduct
);
router.put(
	'/:slug',
	protectRoute,
	authorize('vendor'),
	upload.array('images'),
	updateProduct
);

export default router;
