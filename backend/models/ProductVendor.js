import mongoose from 'mongoose';

const productVendorSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	vendor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Vendor',
		required: true,
	},
	price: { type: Number, required: true },
	stock: {
		type: Number,
		required: true,
	},
	vendorDescription: { type: String },
	vendorImages: [{ type: String }],
	isActive: { type: Boolean, default: false },
});

export const ProductVendor = mongoose.model(
	'ProductVendor',
	productVendorSchema
);
