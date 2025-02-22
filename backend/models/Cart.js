import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
	productVendor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ProductVendor',
		required: true,
	},
	quantity: {
		type: Number,
		min: 1,
		required: true,
	},
	price: { type: Number },
});

const cartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
		items: [cartItemSchema],
		totalPrice: { type: Number, default: 0, required: true },
	},
	{ timestamps: true }
);

export const Cart = mongoose.model('Cart', cartSchema);
