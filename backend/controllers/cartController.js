import { Cart } from '../models/Cart.js';

export const getCart = async (req, res) => {
	try {
		const cart = await Cart.findOne({ user: req.user.userId }).populate(
			'items.productVendor'
		);

		if (!cart) {
			return res.status(404).json({ message: 'Cart not found' });
		}

		res.json(cart);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const addToCart = async (req, res) => {
	const { defaultVendor, quantity } = req.body;
	const userId = req.user.userId;

	try {
		if (!defaultVendor || typeof defaultVendor.price !== 'number') {
			return res.status(400).json({ message: 'Geçersiz ürün fiyatı.' });
		}

		let cart = await Cart.findOne({ user: userId }).populate(
			'items.productVendor'
		);

		if (!cart) {
			cart = new Cart({
				user: userId,
				items: [],
				totalPrice: 0,
			});
		}

		const existingItem = cart.items.find(
			(item) =>
				item.productVendor._id.toString() === defaultVendor._id.toString()
		);

		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			cart.items.push({
				productVendor: defaultVendor,
				quantity,
				price: defaultVendor.price,
			});
		}

		cart.totalPrice = cart.items.reduce((total, item) => {
			return total + item.price * item.quantity;
		}, 0);

		await cart.save();

		res.status(201).json({ message: 'Ürün sepete eklendi', cart });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const removeFromCart = async (req, res) => {
	const { defaultVendor } = req.body;
	const userId = req.user.userId;
	try {
		const cart = await Cart.findOne({ user: userId }).populate(
			'items.productVendor'
		);

		if (!cart) {
			return res.status(404).json({ message: 'Cart not found' });
		}

		const productIndex = cart.items.findIndex(
			(item) =>
				item.productVendor._id.toString() === defaultVendor._id.toString()
		);

		if (productIndex === -1) {
			return res.status(404).json({ message: 'Product not found' });
		}

		cart.items.splice(productIndex, 1);

		cart.totalPrice = cart.items.reduce((total, item) => {
			return total + item.price * item.quantity;
		}, 0);

		await cart.save();

		res.json({ message: 'Ürün sepetten cikarildi', cart });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const updateItemInCart = async (req, res) => {
	const { defaultVendor, quantity } = req.body;
	const userId = req.user.userId;

	if (quantity <= 0) {
		return res.status(400).json({ message: 'Invalid quantity' });
	}
	try {
		const cart = await Cart.findOne({ user: userId }).populate(
			'items.productVendor'
		);

		if (!cart) {
			return res.status(404).json({ message: 'Cart not found' });
		}

		const item = cart.items.find(
			(item) => item.productVendor._id.toString() === defaultVendor._id
		);

		if (!item) {
			return res.status(404).json({ message: 'Product is not in your cart!' });
		}

		item.quantity = quantity;

		cart.totalPrice = cart.items.reduce((total, item) => {
			return total + item.price * item.quantity;
		}, 0);

		await cart.save();

		res.json({ message: 'Ürün guncellendi', cart });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const clearCart = async (req, res) => {
	const userId = req.user.userId;

	try {
		const cart = await Cart.findOne({ user: userId }).populate(
			'items.productVendor'
		);

		if (!cart) {
			return res.status(404).json({ message: 'Cart not found' });
		}

		cart.items = [];
		cart.totalPrice = 0;

		await cart.save();

		res.status(200).json({ message: 'Cart has been successfully cleared.' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
