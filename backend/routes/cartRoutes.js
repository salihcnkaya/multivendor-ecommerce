import express from 'express';

import { authorize, protectRoute } from '../middleware/authMiddleware.js';
import {
	addToCart,
	clearCart,
	getCart,
	removeFromCart,
	updateItemInCart,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', protectRoute, getCart);
router.post('/add', protectRoute, addToCart);
router.post('/remove', protectRoute, removeFromCart);
router.post('/update', protectRoute, updateItemInCart);
router.put('/clear', protectRoute, clearCart);

export default router;
