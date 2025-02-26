import { ProductVendor } from '../models/ProductVendor.js';
import { Order } from '../models/Order.js';

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
		const orders = await Order.find({ 'items.vendor': userId });

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
