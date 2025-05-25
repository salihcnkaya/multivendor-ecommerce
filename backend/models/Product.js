import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		images: [{ type: String }],
		category: { type: String, required: true },
		slug: { type: String, required: true },
		isApproved: { type: Boolean, default: false },
		requestFrom: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Vendor',
		},
	},
	{ timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
