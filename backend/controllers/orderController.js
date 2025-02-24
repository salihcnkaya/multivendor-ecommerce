import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Address } from '../models/Address.js';

export const createOrder = async (req, res) => {
	const userId = req.user.userId;

	try {
		const cart = await Cart.findOne({ user: userId }).populate(
			'items.productVendor'
		);

		if (!cart || !cart.items.length) {
			return res.status(404).json({ message: 'Sepet bulunamadi' });
		}

		const orderItems = cart.items.map((item) => ({
			productVendor: item.productVendor,
			quantity: item.quantity,
			price: item.price,
		}));

		const newOrder = new Order({
			user: userId,
			items: orderItems,
			totalPrice: cart.totalPrice,
			// address: addresId,
		});

		await newOrder.save();

		await Cart.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0 });

		res.status(201).json({ message: 'Siparis olusturuldu' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
