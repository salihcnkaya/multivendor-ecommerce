import express from 'express';

import { authorize, protectRoute } from '../middleware/authMiddleware.js';
import {
	approveProduct,
	getUnpapprovedProducts,
} from '../controllers/adminController.js';

const router = express.Router();

router.get(
	'/products/unapproved',
	protectRoute,
	authorize('admin'),
	getUnpapprovedProducts
);

router.put(
	'/approve-product/:slug',
	protectRoute,
	authorize('admin'),
	approveProduct
);

export default router;
