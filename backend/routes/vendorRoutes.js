import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import {
	getVendorOrders,
	getVendorProducts,
	getVendorProfile,
	updateVendorProfile,
} from '../controllers/vendorController.js';

const router = express.Router();

router.get('/profile', protectRoute, getVendorProfile);
router.put('/profile/update', protectRoute, updateVendorProfile);
router.get('/products', protectRoute, getVendorProducts);
router.get('/orders', protectRoute, getVendorOrders);

export default router;
