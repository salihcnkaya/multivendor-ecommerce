import express from 'express';

import { authorize, protectRoute } from '../middleware/authMiddleware.js';
import { createOrder, getUserOrders } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', protectRoute, getUserOrders);
router.post('/create', protectRoute, createOrder);
export default router;
