import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Address } from '../models/Address.js';

export const createOrder = async (req, res) => {
	const userId = req.user.userId;
	const { addressId } = req.body;

	try {
		const cart = await Cart.findOne({ user: userId }).populate(
			'items.productVendor'
		);

		if (!cart || !cart.items.length) {
			return res.status(404).json({ message: 'Sepet bulunamadi' });
		}

		const address = await Address.findById(addressId);
		if (!address) {
			return res.status(404).json({ message: 'Adres bulunamadi' });
		}

		const orderItems = cart.items.map((item) => ({
			productVendor: item.productVendor,
			vendor: item.productVendor.vendor,
			quantity: item.quantity,
			price: item.price,
		}));

		const newOrder = new Order({
			user: userId,
			items: orderItems,
			totalPrice: cart.totalPrice,
			address: {
				title: address.title,
				country: address.country,
				city: address.city,
				district: address.district,
				address: address.address,
				buildingNo: address.buildingNo,
				apartmentNo: address.apartmentNo,
				phoneNumber: address.phoneNumber,
			},
		});

		await newOrder.save();

		await Cart.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0 });

		res.status(201).json({ message: 'Siparis olusturuldu' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getUserOrders = async (req, res) => {
	const user = req.user.userId;

	try {
		const orders = await Order.find({ user })
			.populate({
				path: 'items.productVendor',
				populate: [{ path: 'product', model: 'Product' }],
			})
			.populate({ path: 'items.vendor', model: 'Vendor' })
			.populate({ path: 'address', model: 'Address' });

		if (!orders) {
			return res.status(404).json({ message: 'Orders not found' });
		}

		const isValidOrder = orders.every(
			(order) => order.user.toString() === user.toString()
		);

		if (!isValidOrder) {
			return res
				.status(403)
				.json({ message: 'This order is not related to you.' });
		}

		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getOrderDetails = async (req, res) => {
	const { orderId } = req.params;
	const { userId, role } = req.user;

	try {
		const order = await Order.findById(orderId);

		if (!order) {
			return res.status(404).json({ message: 'Order not found!' });
		}

		if (userId !== order.user.toString() && role !== 'admin') {
			return res
				.status(403)
				.json({ message: 'This order is not related to you!' });
		}

		res.json(order);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
