import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
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
		role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
	},
	{ timestamps: true }
);

adminSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

adminSchema.methods.matchPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

export const Admin = mongoose.model('Admin', adminSchema);
