import { ProductVendor } from '../models/ProductVendor.js';
import { Order } from '../models/Order.js';
import { Vendor } from '../models/Vendor.js';

export const getVendorProfile = async (req, res) => {
	const user = req.user.userId;

	try {
		const profileData = await Vendor.findById(user)
			.select('name surname email addresses storeName')
			.populate('addresses');

		if (!profileData) {
			return res.status(404).json({ message: 'Profile not found!' });
		}

		if (profileData._id.toString() !== user.toString()) {
			return res
				.status(403)
				.json({ message: 'This profile is not related to you.' });
		}

		res.json(profileData);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const updateVendorProfile = async (req, res) => {
	const user = req.user.userId;
	const { name, surname, email } = req.body;

	try {
		const profileData = await Vendor.findById(user).select(
			'name surname email'
		);

		if (!profileData) {
			return res.status(404).json({ message: 'Profile not found!' });
		}

		if (profileData._id.toString() !== user.toString()) {
			return res
				.status(403)
				.json({ message: 'This profile is not related to you.' });
		}

		profileData.name = name || profileData.name;
		profileData.surname = surname || profileData.surname;
		profileData.email = email || profileData.email;

		await profileData.save();
		res.status(200).json({ message: 'Profile updated' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getVendorProducts = async (req, res) => {
	const userId = req.user.userId;
	try {
		const products = await ProductVendor.find({ vendor: userId }).populate(
			'product'
		);

		if (!products) {
			return res
				.status(404)
				.json({ message: 'This vendor does not have any products!' });
		}

		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getVendorOrders = async (req, res) => {
	const userId = req.user.userId;
	try {
		const orders = await Order.find({ 'items.vendor': userId })
			.populate('user', 'name surname email')
			.populate({
				path: 'items.productVendor',
				populate: [{ path: 'product', model: 'Product' }],
			});

		const filteredOrders = orders.map((order) => {
			const filteredItems = order.items.filter(
				(item) => item.vendor.toString() === userId
			);

			return { ...order.toObject(), items: filteredItems };
		});

		if (!filteredOrders.length) {
			return res
				.status(404)
				.json({ message: 'No matching orders found for this vendor!' });
		}

		res.json(filteredOrders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
