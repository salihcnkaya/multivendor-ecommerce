import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'role' },
		token: { type: String, required: true },
		expiresAt: { type: Date, required: true },
		role: { type: String, required: true },
	},
	{ timestamps: true }
);

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
