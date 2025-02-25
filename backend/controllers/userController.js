import { User } from '../models/User.js';

export const getUserProfile = async (req, res) => {
	const user = req.user.userId;

	try {
		const profileData = await User.findById(user)
			.select('name surname email adresses')
			.populate('addresses');

		if (!profileData) {
			return res.status(404).json({ message: 'Profile not found!' });
		}

		if (profileData._id.toString() !== user.toString()) {
			return res
				.status(403)
				.json({ message: 'This profile is not related to you.' });
		}

		res.json(profileData);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const updateUserProfile = async (req, res) => {
	const user = req.user.userId;
	const { name, surname, email } = req.body;

	try {
		const profileData = await User.findById(user).select('name surname email');

		if (!profileData) {
			return res.status(404).json({ message: 'Profile not found!' });
		}

		if (profileData._id.toString() !== user.toString()) {
			return res
				.status(403)
				.json({ message: 'This profile is not related to you.' });
		}

		profileData.name = name || profileData.name;
		profileData.surname = surname || profileData.surname;
		profileData.email = email || profileData.email;

		await profileData.save();
		res.status(200).json({ message: 'Profile updated' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
