import express from 'express';
import {
	addAddress,
	deleteAdress,
	getAddresses,
	updateAddress,
} from '../controllers/addressController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectRoute, getAddresses);
router.post('/add', protectRoute, addAddress);
router.delete('/delete/:addressId', protectRoute, deleteAdress);
router.put('/update', protectRoute, updateAddress);

export default router;
