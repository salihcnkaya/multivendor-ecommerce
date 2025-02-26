import { Address } from '../models/Address.js';
import { User } from '../models/User.js';
import { Vendor } from '../models/Vendor.js';

export const addAddress = async (req, res) => {
	const { userId, role } = req.user;
	const {
		title,
		country,
		city,
		district,
		address,
		buildingNo,
		phoneNumber,
		apartmentNo,
		isDefault,
	} = req.body;

	try {
		const newAddress = new Address({
			user: role === 'user' ? userId : null,
			vendor: role === 'vendor' ? userId : null,
			title,
			country,
			city,
			district,
			address,
			buildingNo,
			phoneNumber,
			apartmentNo,
			isDefault: isDefault,
		});

		const savedAddress = await newAddress.save();

		if (role === 'user') {
			await User.findByIdAndUpdate(
				{ _id: userId },
				{
					$push: { addresses: savedAddress._id },
				}
			);
		} else if (role === 'vendor') {
			await Vendor.findByIdAndUpdate(
				{ _id: userId },
				{
					$push: { addresses: savedAddress._id },
				}
			);
		}

		res.status(201).json({ message: 'Address saved', savedAddress });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getAddresses = async (req, res) => {
	const { userId, role } = req.user;

	try {
		let addresses;
		if (role === 'user') {
			addresses = await Address.find({ user: userId });
		} else if (role === 'vendor') {
			addresses = await Address.find({ user: userId });
		}

		if (!addresses) {
			return res.status(404).json({ message: 'No address found!' });
		}

		res.status(200).json({ addresses });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const updateAddress = async (req, res) => {
	const { userId, role } = req.user;
	const {
		addressId,
		title,
		country,
		city,
		district,
		address,
		buildingNo,
		phoneNumber,
		apartmentNo,
		isDefault,
	} = req.body;

	try {
		const currentAddress = await Address.findById(addressId);

		if (
			role === 'user' &&
			currentAddress.user.toString() !== userId.toString()
		) {
			return res
				.status(403)
				.json({ message: 'This address is not related to you.' });
		}

		if (
			role === 'vendor' &&
			currentAddress.vendor.toString() !== userId.toString()
		) {
			return res
				.status(403)
				.json({ message: 'This address is not related to you.' });
		}

		currentAddress.title = title || currentAddress.title;
		currentAddress.country = country || currentAddress.country;
		currentAddress.city = city || currentAddress.city;
		currentAddress.district = district || currentAddress.district;
		currentAddress.address = address || currentAddress.address;
		currentAddress.buildingNo = buildingNo || currentAddress.buildingNo;
		currentAddress.phoneNumber = phoneNumber || currentAddress.phoneNumber;
		currentAddress.apartmentNo = apartmentNo || currentAddress.apartmentNo;
		currentAddress.isDefault =
			isDefault !== undefined ? isDefault : currentAddress.isDefault;

		await currentAddress.save();
		res.status(200).json({ message: 'Address updated' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteAdress = async (req, res) => {
	const { userId, role } = req.user;
	const { addressId } = req.params;

	try {
		const currentAddress = await Address.findById(addressId);

		if (!currentAddress) {
			return res.status(404).json({ message: 'Address not found' });
		}

		if (
			role === 'user' &&
			currentAddress.user.toString() !== userId.toString()
		) {
			return res
				.status(403)
				.json({ message: 'This address is not related to you.' });
		}

		if (
			role === 'vendor' &&
			currentAddress.vendor.toString() !== userId.toString()
		) {
			return res
				.status(403)
				.json({ message: 'This address is not related to you.' });
		}

		if (role === 'user') {
			await User.findByIdAndUpdate(userId, {
				$pull: { addresses: addressId },
			});
		}

		if (role === 'vendor') {
			await Vendor.findByIdAndUpdate(userId, {
				$pull: { addresses: addressId },
			});
		}

		await Address.findByIdAndDelete(addressId);
		res.status(200).json({ message: 'Addres deleted successfully.' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
