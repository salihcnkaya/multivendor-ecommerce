import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
	productVendor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ProductVendor',
		required: true,
	},
	vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVendor' },
	quantity: {
		type: Number,
		min: 1,
		required: true,
	},
	price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		items: [orderItemSchema],
		totalPrice: { type: Number, required: true },
		status: {
			type: String,
			enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
			default: 'pending',
		},
		paymentStatus: {
			type: String,
			enum: ['unpaid', 'paid'],
			default: 'unpaid',
		},
		address: {
			title: { type: String, required: true },
			country: { type: String, required: true },
			city: { type: String, required: true },
			district: { type: String, required: true },
			address: { type: String, required: true },
			buildingNo: { type: String, required: true },
			apartmentNo: { type: String, required: true },
			phoneNumber: { type: String },
		},
	},
	{ timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
