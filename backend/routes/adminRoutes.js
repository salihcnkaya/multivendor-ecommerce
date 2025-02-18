import express from 'express';

import { authorize, protectRoute } from '../middleware/authMiddleware.js';
import { approveProduct } from '../controllers/adminController.js';

const router = express.Router();

router.put(
	'/approve-product/:slug',
	protectRoute,
	authorize('admin'),
	approveProduct
);

export default router;
