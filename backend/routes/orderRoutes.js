import express from 'express';

import { authorize, protectRoute } from '../middleware/authMiddleware.js';
import { createOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/create', protectRoute, createOrder);
export default router;
