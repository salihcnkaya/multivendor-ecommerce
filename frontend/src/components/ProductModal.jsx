import React, { useState, useEffect } from 'react';
import DragAndDrop from './DragAndDrop';

const Modal = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative ">
				<button
					className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
					onClick={onClose}
				>
					&#x2715;
				</button>
				{children}
			</div>
		</div>
	);
};

export const ConfirmationModal = ({ isOpen, onClose, onSubmit }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-lg font-bold mb-4">Silmeyi onaylıyor musun?</h2>
			<div className="flex justify-start gap-2">
				<button
					className="px-4 py-2 bg-orange-500 hover:bg-orange-600 transition-all text-white rounded-lg"
					onClick={() => {
						onSubmit();
						onClose();
					}}
				>
					Onayla
				</button>
				<button
					className="px-4 py-2 bg-zinc-500 hover:bg-zinc-600 transition-all text-white rounded-lg"
					onClick={onClose}
				>
					Iptal
				</button>
			</div>
		</Modal>
	);
};

export const ProductModal = ({
	isOpen,
	onClose,
	onSubmit,
	selectedProduct,
}) => {
	const [formData, setFormData] = useState({
		slug: '',
		name: '',
		description: '',
		price: 0,
		stock: 0,
		category: '',
	});

	const [images, setImages] = useState([]);

	useEffect(() => {
		if (selectedProduct) {
			setFormData({
				slug: selectedProduct.slug || selectedProduct.product.slug || '',
				name: selectedProduct.name || selectedProduct.product.name || '',
				description:
					selectedProduct.description ||
					selectedProduct.product.description ||
					'',
				price: selectedProduct.price || 0,
				stock: selectedProduct.stock || 0,
				category:
					selectedProduct.category || selectedProduct.product.category || '',
			});
		}
	}, [selectedProduct]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// onSubmit(formData);
		// onClose();

		const data = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			data.append(key, value);
		});

		images.forEach((file) => {
			data.append('images', file);
		});

		onSubmit(data);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-lg font-bold">Ürün Bilgilerini Giriniz</h2>
			<DragAndDrop isOpen={isOpen} onFilesChange={setImages} />
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-sm">Ürün Adı</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="name"
						value={formData.name}
						onChange={handleChange}
						disabled={!!selectedProduct}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm">Ürün Açıklaması</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="description"
						value={formData.description}
						onChange={handleChange}
						disabled={!!selectedProduct}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm">Ürün Kategorisi</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="category"
						value={formData.category}
						onChange={handleChange}
						disabled={!!selectedProduct}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm">Ürün Fiyati</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="price"
						value={formData.price}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm">Ürün Stogu</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="stock"
						value={formData.stock}
						onChange={handleChange}
						required
					/>
				</div>
				<button
					type="submit"
					className="px-4 py-2 bg-orange-500 hover:bg-orange-600 transition-all text-white rounded-lg"
				>
					Submit
				</button>
			</form>
		</Modal>
	);
};
export const AddressModal = ({
	isOpen,
	onClose,
	onSubmit,
	selectedAddress,
}) => {
	const [addressData, setAddressData] = useState({
		addressId: '',
		title: '',
		country: '',
		city: '',
		district: '',
		address: '',
		buildingNo: '',
		apartmentNo: '',
		phoneNumber: '',
	});

	useEffect(() => {
		if (selectedAddress) {
			setAddressData({
				addressId: selectedAddress._id || '',
				title: selectedAddress.title || '',
				country: selectedAddress.country || '',
				city: selectedAddress.city || '',
				district: selectedAddress.district || '',
				address: selectedAddress.address || '',
				buildingNo: selectedAddress.buildingNo || '',
				apartmentNo: selectedAddress.apartmentNo || '',
				phoneNumber: selectedAddress.phoneNumber || '',
			});
		}
	}, [selectedAddress]);

	const handleChange = (e) => {
		setAddressData({ ...addressData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(addressData);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-lg font-bold">Adres Bilgilerini Giriniz</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-sm">Adres Adı</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="title"
						value={addressData.title}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm">Ülke</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="country"
						value={addressData.country}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm">Şehir</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="city"
						value={addressData.city}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm">İlçe</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="district"
						value={addressData.district}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm">Adres</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="address"
						value={addressData.address}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm">Bina No</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="buildingNo"
						value={addressData.buildingNo}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm">Daire No</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="apartmentNo"
						value={addressData.apartmentNo}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm">Telefon</label>
					<input
						className="w-full px-3 py-2 border rounded-lg"
						name="phoneNumber"
						value={addressData.phoneNumber}
						onChange={handleChange}
						required
					/>
				</div>
				<button
					type="submit"
					className="px-4 py-2 bg-orange-500 hover:bg-orange-600 transition-all text-white rounded-lg"
				>
					Submit
				</button>
			</form>
		</Modal>
	);
};
