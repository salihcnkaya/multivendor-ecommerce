import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import {
	getUserProfile,
	updateUserProfile,
} from '../controllers/userController.js';

import { getUserOrders } from '../controllers/orderController.js';

const router = express.Router();

router.get('/profile', protectRoute, getUserProfile);
router.put('/profile/update', protectRoute, updateUserProfile);
router.get('/orders', protectRoute, getUserOrders);

export default router;
