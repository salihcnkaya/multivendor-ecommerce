import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		token: { type: String, required: true },
		expiresAt: { type: Date, required: true },
	},
	{ timestamps: true }
);

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
