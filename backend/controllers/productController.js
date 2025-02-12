import { Product } from '../models/Product.js';
import { ProductVendor } from '../models/ProductVendor.js';
import { Vendor } from '../models/Vendor.js';
import { generateSlug } from '../utils/generateSlug.js';

import mongoose from 'mongoose';

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

		productVendor.productSlug = generateSlug(name);
		await productVendor.save();

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
		const productVendors = await ProductVendor.find({ productSlug: slug })
			.populate('vendor', '_id storeName slug')
			.sort({ price: 1 });

		if (productVendors.length === 0) {
			return res.status(404).json({ message: 'Product not found!' });
		}

		let defaultProduct = await Product.findOne({
			_id: productVendors[0].product,
		});

		if (magaza) {
			const vendor = await Vendor.findOne({ slug: generateSlug(magaza) });

			if (!vendor) {
				return res.status(404).json({ message: 'Vendor not found!' });
			}

			const vendorProduct = productVendors.find(
				(pv) => pv.vendor._id.toString() === vendor._id.toString()
			);

			if (vendorProduct) {
				defaultProduct = await Product.findOne({ _id: vendorProduct.product });
			}
		}

		const otherVendors = productVendors.filter(
			(pv) => pv.product._id.toString() !== defaultProduct._id.toString()
		);

		res.status(200).json({
			defaultProduct,
			productVendor: productVendors.filter(
				(pv) => pv.product._id.toString() === defaultProduct._id.toString()
			),
			otherVendors,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const vendorId = req.user.userId;
		const { slug } = req.params;

		const vendorProductRelation = await ProductVendor.findOne({
			productSlug: slug,
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
