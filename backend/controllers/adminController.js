import { Product } from '../models/Product.js';
import { ProductVendor } from '../models/ProductVendor.js';

export const getUnpapprovedProducts = async (req, res) => {
	try {
		const products = await Product.find({ isApproved: false }).populate(
			'requestFrom'
		);
		if (!products.length) {
			return res.status(404).json({ message: 'No unapproved products.' });
		}
		res.json({ products });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const approveProduct = async (req, res) => {
	const { slug } = req.params;

	try {
		const product = await Product.findOne({ slug });

		if (!product) {
			return res.status(404).json({ message: 'Product not found.' });
		}

		if (product.isApproved) {
			return res.status(400).json({ message: 'Product already approved' });
		}

		product.isApproved = true;

		await product.save();

		await ProductVendor.updateMany(
			{ product: product._id },
			{ isActive: true }
		);

		res
			.status(200)
			.json({ message: 'Product and seller listings have been approved.' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
