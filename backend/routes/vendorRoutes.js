import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import {
	getVendorOrders,
	getVendorProducts,
} from '../controllers/vendorController.js';

const router = express.Router();

router.get('/products', protectRoute, getVendorProducts);
router.get('/orders', protectRoute, getVendorOrders);

export default router;
