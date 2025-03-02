import cookieParser from 'cookie-parser';
import express from 'express';
import dotenv from 'dotenv';
import userAuthRoutes from './routes/userAuthRoutes.js';
import vendorAuthRoutes from './routes/vendorAuthRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import userRoutes from './routes/userRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import { connectDB } from './config/db.js';
import { authorize, protectRoute } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/user', userAuthRoutes);
app.use('/api/auth/vendor', vendorAuthRoutes);
app.use('/api/auth/admin', adminAuthRoutes);

app.use('/api/user', userRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/products', productRoutes);

app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.use('/api/address', addressRoutes);

app.listen(PORT, () => {
	connectDB();
	console.log(`Server is running on port ${PORT}`);
});
