import cookieParser from 'cookie-parser';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
