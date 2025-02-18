import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		images: [{ type: String }],
		category: { type: String, required: true },
		slug: { type: String, required: true },
		isApproved: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
