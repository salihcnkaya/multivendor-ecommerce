import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import jwt from 'jsonwebtoken';
import { Vendor } from '../models/Vendor.js';
import { Admin } from '../models/Admin.js';

const getModel = (role) => {
	const normalizedRole = role.toLowerCase();
	switch (normalizedRole) {
		case 'user':
			return User;
		case 'vendor':
			return Vendor;
		case 'admin':
			return Admin;
		default:
			throw new Error('Unknown role');
	}
};

export const register = async (req, res) => {
	const { name, surname, email, password, role, storeName } = req.body;

	if (req.originalUrl.includes('user') && role !== 'user') {
		return res
			.status(400)
			.json({ message: 'Invalid role for user registration' });
	}
	if (req.originalUrl.includes('vendor') && role !== 'vendor') {
		return res
			.status(400)
			.json({ message: 'Invalid role for vendor registration' });
	}
	if (req.originalUrl.includes('admin') && role !== 'admin') {
		return res
			.status(400)
			.json({ message: 'Invalid role for admin registration' });
	}

	try {
		const Model = getModel(role);
		const userAlreadyExists = await Model.findOne({ email });

		if (userAlreadyExists) {
			return res.status(400).json({ message: `${role} already exists.` });
		}

		const user = new Model({
			name,
			surname,
			email,
			password,
			role,
			...(role === 'vendor' ? { storeName } : {}),
		});
		await user.save();

		res.status(201).json({ user: { ...user._doc, password: undefined } });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	const { email, password, role } = req.body;

	try {
		const Model = getModel(role);
		const user = await Model.findOne({ email });
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
			{ userId: user._id, role: user.role },
			process.env.JWT_REFRESH_SECRET,
			{ expiresIn: '7d' }
		);

		const existingRefreshToken = await RefreshToken.findOne({
			userId: user._id,
		});
		if (existingRefreshToken) {
			await existingRefreshToken.deleteOne();
		}

		const upperCaseRole =
			user.role.charAt(0).toUpperCase() + user.role.slice(1);
		const newRefreshToken = new RefreshToken({
			userId: user._id,
			token: refreshToken,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			role: upperCaseRole,
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

		res.status(201).json({ user: { ...user._doc, password: undefined } });
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
		const Model = getModel(refreshTokenRecord.role);
		const user = await Model.findById(refreshTokenRecord.userId);
		if (!user) {
			return res.status(403).json({ message: 'User not found' });
		}

		const accessToken = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_ACCESS_SECRET,
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

export const checkAuth = async (req, res) => {
	const { userId, role } = req.user;
	try {
		const Model = getModel(role);

		const user = await Model.findById(userId);
		if (!user) {
			return res.status(404).json({ message: `${role} not found.` });
		}

		res.status(200).json({ user: { ...user._doc, password: undefined } });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
