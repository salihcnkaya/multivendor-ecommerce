import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
	title: { type: String, required: true },
	country: { type: String, required: true },
	city: { type: String, required: true },
	district: { type: String, required: true },
	address: { type: String, required: true },
	buildingNo: { type: String, required: true },
	phoneNumber: { type: String },
	apartmentNo: { type: String, required: true },
	isDefault: { type: Boolean, default: false },
});

export const Address = mongoose.model('Address', addressSchema);
