import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
	const { name, surname, email, password, role } = req.body;

	try {
		const userAlreadyExists = await User.findOne({ email });

		if (userAlreadyExists) {
			return res.status(400).json({ message: 'User already exists.' });
		}

		const user = new User({ name, surname, email, password, role });
		await user.save();

		res.status(201).json({ user: { ...user._doc, password: undefined } });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'Invalid Credentials' });
		}

		const passMatch = await user.matchPassword(password);

		if (!passMatch) {
			return res.status(400).json({ message: 'Invalid Credentials' });
		}

		const accessToken = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_ACCESS_SECRET,
			{ expiresIn: '1h' }
		);

		const refreshToken = jwt.sign(
			{ userId: user._id },
			process.env.JWT_REFRESH_SECRET,
			{ expiresIn: '7d' }
		);

		const existingRefreshToken = await RefreshToken.findOne({
			userId: user._id,
		});
		if (existingRefreshToken) {
			await existingRefreshToken.deleteOne();
		}

		const newRefreshToken = new RefreshToken({
			userId: user._id,
			token: refreshToken,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		await newRefreshToken.save();

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			maxAge: 60 * 60 * 1000,
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({ message: 'Logged in successfully' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		const { refreshToken } = req.cookies;
		if (refreshToken) {
			await RefreshToken.deleteOne({ token: refreshToken });
			res.clearCookie('refreshToken');
		}
		res.clearCookie('accessToken');
		res.status(200).json({ message: 'Logged out successfully' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const refreshToken = async (req, res) => {
	const { refreshToken: refreshTokenFromCookie } = req.cookies;

	if (!refreshTokenFromCookie) {
		return res.status(401).json({ message: 'No refresh token provided' });
	}

	try {
		const refreshTokenRecord = await RefreshToken.findOne({
			token: refreshTokenFromCookie,
		});
		if (!refreshTokenRecord) {
			return res.status(403).json({ message: 'Invalid refresh token' });
		}

		if (new Date() > refreshTokenRecord.expiresAt) {
			return res.status(403).json({ message: 'Refresh token has expired' });
		}

		const user = await User.findById(refreshTokenRecord.userId);
		if (!user) {
			return res.status(403).json({ message: 'User not found' });
		}

		const accessToken = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: true,
			maxAge: 60 * 60 * 1000,
		});

		res.status(200).json({
			message: 'Access token refreshed successfully',
		});
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};
