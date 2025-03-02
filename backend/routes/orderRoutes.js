import express from 'express';

import { authorize, protectRoute } from '../middleware/authMiddleware.js';
import {
	createOrder,
	getOrderDetails,
	getUserOrders,
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/', protectRoute, getUserOrders);
router.post('/create', protectRoute, createOrder);
router.get('/:orderId', protectRoute, getOrderDetails);
export default router;
