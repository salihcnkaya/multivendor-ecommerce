import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { generateSlug } from '../utils/generateSlug.js';

const vendorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		surname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: { type: String, enum: ['vendor'], default: 'vendor' },
		storeName: {
			type: String,
			required: true,
			unique: true,
		},
		slug: {
			type: String,
			unique: true,
		},
		products: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
	},
	{ timestamps: true }
);

vendorSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);

	if (this.isNew || this.isModified('storeName')) {
		this.slug = generateSlug(this.storeName);
	}
	next();
});

vendorSchema.methods.matchPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

export const Vendor = mongoose.model('Vendor', vendorSchema);
