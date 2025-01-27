import { Product } from '../models/Product.js';
import { ProductVendor } from '../models/ProductVendor.js';
import { Vendor } from '../models/Vendor.js';
import { generateSlug } from '../utils/generateSlug.js';

export const createProduct = async (req, res) => {
	const { name, description, price, stock, category } = req.body;
	const vendorId = req.user.userId;

	try {
		const product = new Product({
			name,
			description,
			category,
		});

		product.slug = generateSlug(name);
		await product.save();

		const productVendor = new ProductVendor({
			product: product._id,
			vendor: vendorId,
			price,
			stock,
		});

		await productVendor.save();

		await Vendor.findByIdAndUpdate(vendorId, {
			$push: { products: product._id },
		});

		res.status(201).json({ message: 'Product created successfully' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find();

		if (!products.length) {
			return res.status(404).json({ message: 'No products' });
		}
		res.json({ products });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getProductDetails = async (req, res) => {
	const { slug } = req.params;
	const { magaza } = req.query;

	try {
		const products = await Product.find({ slug });
		console.log(products);
		let defaultProduct = products[0];

		if (magaza) {
			const vendor = await Vendor.findOne({ slug: generateSlug(magaza) });

			if (!vendor)
				return res.status(404).json({ message: 'Vendor not found!' });

			const vendorProductRelation = await ProductVendor.findOne({
				product: { $in: products.map((p) => p._id) },
				vendor: vendor._id,
			});

			if (vendorProductRelation) {
				defaultProduct = products.find(
					(p) => p._id.toString() === vendorProductRelation.product.toString()
				);
			}
		}

		if (!magaza) {
			const defaultVendorProduct = await ProductVendor.find({
				product: { $in: products.map((p) => p._id) },
			})
				.populate('vendor', '_id storeName slug')
				.sort({ price: 1 }) // En ucuz fiyatlı vendor
				.limit(1);

			if (defaultVendorProduct.length > 0) {
				// Default vendor belirle
				defaultProduct = products.find(
					(p) => p._id.toString() === defaultVendorProduct[0].product.toString()
				);
			}
		}

		const productVendorQuery = await ProductVendor.find({
			product: defaultProduct._id,
		}).populate('vendor', '_id storeName slug');

		const otherVendorsQuery = await ProductVendor.find({
			product: { $in: products.map((p) => p._id) },
			product: { $ne: defaultProduct._id },
		}).populate('vendor', '_id storeName slug');

		res.status(200).json({
			defaultProduct,
			productVendor: productVendorQuery,
			otherVendors: otherVendorsQuery,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const vendorId = req.user.userId;
		const { slug } = req.params;

		const products = await Product.find({ slug });

		if (!products) {
			return res.status(404).json({ message: 'No product found!' });
		}

		const vendorProductRelation = await ProductVendor.findOne({
			product: { $in: products.map((p) => p._id) },
			vendor: vendorId,
		});

		if (!vendorProductRelation) {
			return res
				.status(403)
				.json({ message: 'This product is not related to you.' });
		}

		await Product.findByIdAndDelete(vendorProductRelation.product._id);
		await ProductVendor.findByIdAndDelete(vendorProductRelation._id);

		return res.status(200).json({ message: 'Product deleted successfully' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
