import cookieParser from 'cookie-parser';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { connectDB } from './config/db.js';
import { authorize, protectRoute } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
	connectDB();
	console.log(`Server is running on port ${PORT}`);
});
