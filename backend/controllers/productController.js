import { Product } from '../models/Product.js';
import { ProductVendor } from '../models/ProductVendor.js';
import { Vendor } from '../models/Vendor.js';
import { generateSlug } from '../utils/generateSlug.js';

export const createProduct = async (req, res) => {
	const {
		name,
		description,
		price,
		stock,
		category,
		vendorDescription,
		vendorImages,
	} = req.body;
	const vendorId = req.user.userId;

	try {
		const slug = generateSlug(name);

		let product = await Product.findOne({ slug });

		if (!product) {
			product = new Product({
				name,
				slug,
				description,
				category,
				isApproved: false,
				requestFrom: vendorId,
			});

			await product.save();
		}

		const existingVendor = await ProductVendor.findOne({
			product: product._id,
			vendor: vendorId,
		});

		if (existingVendor) {
			return res
				.status(400)
				.json({ message: 'This seller already listed this product.' });
		}

		const productVendor = new ProductVendor({
			product: product._id,
			vendor: vendorId,
			price,
			stock,
			vendorDescription,
			vendorImages,
			isActive: product.isApproved,
		});

		await productVendor.save();

		res.status(201).json({
			message:
				'The product has been successfully added. If it is a new product, it is awaiting approval.',
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find({ isApproved: true });

		if (!products.length) {
			return res.status(404).json({ message: 'No products' });
		}

		const productDetails = await Promise.all(
			products.map(async (product) => {
				const defaultVendor = await ProductVendor.findOne({
					product: product._id,
				})
					.sort({ price: 1 })
					.populate('vendor', '_id storeName slug')
					.limit(1);

				return {
					...product.toObject(),
					defaultVendor: defaultVendor || null,
				};
			})
		);
		res.json({ products: productDetails });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getProductDetails = async (req, res) => {
	const { slug } = req.params;
	const { magaza } = req.query;

	try {
		const product = await Product.findOne({ slug, isApproved: true });

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		let productVendors = await ProductVendor.find({ product: product._id })
			.populate('vendor', '_id storeName slug')
			.sort({ price: 1 });

		if (productVendors.length === 0) {
			return res
				.status(404)
				.json({ message: 'No listings found for this product!' });
		}

		let defaultVendor = productVendors[0];

		if (magaza) {
			const vendor = await Vendor.findOne({ slug: generateSlug(magaza) });

			if (!vendor) {
				return res.status(404).json({ message: 'Vendor not found!' });
			}

			const vendorProduct = productVendors.find(
				(listings) => listings.vendor._id.toString() === vendor._id.toString()
			);

			if (vendorProduct) {
				defaultVendor = vendorProduct;
			} else {
				return res.status(404).json({
					message: `This product is not available at ${vendor.storeName}!`,
				});
			}
		}

		const otherVendors = productVendors.filter(
			(listings) =>
				listings.vendor._id.toString() !== defaultVendor.vendor._id.toString()
		);

		res.status(200).json({
			product,
			defaultVendor,
			otherVendors,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	const vendorId = req.user.userId;
	const { slug } = req.params;

	try {
		const product = await Product.findOne({ slug });

		if (!product) {
			res.status(404).json({ message: 'Product not found' });
		}

		const productVendor = await ProductVendor.findOne({
			product: product._id,
			vendor: vendorId,
		});

		if (!productVendor) {
			return res
				.status(403)
				.json({ message: 'This product is not related to you.' });
		}

		const otherVendors = await ProductVendor.find({ product: product._id });

		if (otherVendors.length === 1) {
			await Product.deleteOne({ _id: product._id });
		}

		await ProductVendor.deleteOne({ _id: productVendor._id });

		return res.status(200).json({ message: 'Product deleted successfully' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const searchProduct = async (req, res) => {
	const { search } = req.query;

	try {
		const products = await Product.find({
			isApproved: true,
			name: { $regex: search, $options: 'i' },
		});

		if (!products.length) {
			return res.status(404).json({ message: 'Product not found' });
		}

		const productDetails = await Promise.all(
			products.map(async (product) => {
				const defaultVendor = await ProductVendor.find({
					product: product._id,
				})
					.sort({ price: 1 })
					.populate('vendor', '_id storeName slug')
					.limit(1);

				return {
					...product.toObject(),
					defaultVendor: defaultVendor || null,
				};
			})
		);
		res.status(200).json({ products: productDetails });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const updateProduct = async (req, res) => {
	const { price, stock, vendorDescription } = req.body;
	const vendorId = req.user.userId;
	const { slug } = req.params;

	try {
		const product = await Product.findOne({ slug });

		if (!product) {
			return res.status(404).json({ message: 'Product not found!' });
		}

		const productVendor = await ProductVendor.findOne({
			product: product._id,
			vendor: vendorId,
		});

		if (!productVendor) {
			return res
				.status(403)
				.json({ message: 'This product is not related to you!' });
		}

		productVendor.price = price || productVendor.price;
		productVendor.stock = stock || productVendor.stock;
		productVendor.vendorDescription =
			vendorDescription || productVendor.vendorDescription;

		await productVendor.save();

		res.status(200).json({ message: 'Product updated' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
