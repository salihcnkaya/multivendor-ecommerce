import jwt from 'jsonwebtoken';

export const protectRoute = (req, res, next) => {
	console.log(req.headers);
	const token =
		req.cookies.accessToken ||
		req.header('Authorization')?.replace('Bearer ', '');
	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Token is not valid' });
	}
};

export const authorize = (role) => {
	return (req, res, next) => {
		if (!(role === req.user.role)) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		next();
	};
};
