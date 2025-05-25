import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import { MdModeEdit, MdOutlineAdd } from 'react-icons/md';
import {
	AddressModal,
	ConfirmationModal,
} from '../components/ProductModal.jsx';
import { AddressCard } from '../components/AddressCard.jsx';

const AccountDetails = () => {
	const {
		user,
		update,
		isCheckingAuth,
		userAddresses,
		addAddress,
		editAddress,
		deleteAddress,
	} = useAuth();
	const [isAdressModalOpen, setIsAddressModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState(undefined);

	const [formData, setFormData] = useState({
		name: '',
		surname: '',
		email: '',
	});

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				surname: user.surname || '',
				email: user.email || '',
			});
		}
	}, [user]);

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await update(formData);
		} catch (error) {
			console.log(error);
		}
	};

	const handleEditModal = (address) => {
		console.log(address);
		setSelectedAddress(address);
		setIsAddressModalOpen(true);
	};

	const handleAddAddress = () => {
		setSelectedAddress(undefined);
		setIsAddressModalOpen(true);
	};

	const handleAddressSubmit = (addressForm) => {
		if (selectedAddress) {
			editAddress(addressForm);
		} else {
			addAddress(addressForm);
		}
	};

	const handleDeleteModal = (address) => {
		setSelectedAddress(address);
		setIsDeleteModalOpen(true);
	};

	const handleDeleteSubmit = () => {
		if (selectedAddress) {
			deleteAddress(selectedAddress._id);
			setIsDeleteModalOpen(false);
			setSelectedAddress(undefined);
		}
	};

	if (isCheckingAuth) {
		return (
			<div className="h-screen w-screen flex justify-center items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 my-4 max-sm:pb-16">
			<div className="flex flex-col max-w-lg mx-auto">
				<h2 className="mt-4 text-xl font-semibold text-neutral-700">
					Profil bilgileri
				</h2>
				<form className="mt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
					<div className="flex gap-2">
						<input
							type="text"
							name="name"
							placeholder="Ad"
							value={formData.name}
							onChange={handleFormChange}
							className="bg-white hover:bg-zinc-100 w-full border-2 border-zinc-300 placeholder:text-gray-600 text-gray-600 rounded-lg p-[14px] leading-6 text-base -tracking-wide focus:outline-orange-500 focus:bg-white transition-colors"
						/>
						<input
							type="text"
							name="surname"
							placeholder="Soyad"
							value={formData.surname}
							onChange={handleFormChange}
							className={
								'bg-white hover:bg-zinc-100 w-full border-2 border-zinc-300 placeholder:text-gray-600 text-gray-600 rounded-lg p-[14px] leading-6 text-base -tracking-wide focus:outline-orange-500 focus:bg-white transition-colors'
							}
						/>
					</div>
					<input
						type="email"
						name="email"
						placeholder="E-posta"
						value={formData.email}
						onChange={handleFormChange}
						className={
							'bg-white hover:bg-zinc-100 w-full border-2 border-zinc-300 placeholder:text-gray-600 text-gray-600 rounded-lg p-[14px] leading-6 text-base -tracking-wide focus:outline-orange-500 focus:bg-white transition-colors'
						}
					/>
					<button className="min-w-full flex items-center justify-center rounded-lg font-semibold p-2 bg-orange-500 hover:bg-orange-600 text-white text-base h-14 transition-all">
						Güncelle
					</button>
				</form>

				<h2 className="mt-8 mb-4 text-xl font-semibold text-neutral-700">
					Adres bilgileri
				</h2>
				<div>
					<button
						className="flex items-center gap-2 border border-orange-500 hover:border-orange-600 rounded-lg p-2 mb-4 text-orange-500 hover:text-orange-600 text-sm font-semibold transition-all"
						onClick={handleAddAddress}
					>
						<MdOutlineAdd className="text-xl" />
						Adres ekle
					</button>
					{userAddresses === undefined ? (
						<div className="text-center flex flex-col gap-2">
							<Spinner />
							<span>Adresler yükleniyor...</span>
						</div>
					) : userAddresses.length === 0 ? (
						<div>Kayıtlı adres bulunamadı.</div>
					) : (
						userAddresses.map((address) => (
							<div key={address._id} className="mb-4">
								<AddressCard
									address={address}
									onEditClick={handleEditModal}
									onDeleteClick={handleDeleteModal}
								/>
							</div>
						))
					)}
				</div>
			</div>
			{isAdressModalOpen && (
				<AddressModal
					isOpen={isAdressModalOpen}
					onClose={() => {
						setIsAddressModalOpen(false);
						setSelectedAddress(undefined);
					}}
					selectedAddress={selectedAddress}
					onSubmit={handleAddressSubmit}
				/>
			)}
			{isDeleteModalOpen && (
				<ConfirmationModal
					isOpen={isDeleteModalOpen}
					onClose={() => {
						setIsDeleteModalOpen(false);
						setSelectedAddress(undefined);
					}}
					selectedAddress={selectedAddress}
					onSubmit={handleDeleteSubmit}
				/>
			)}
		</div>
	);
};

export default AccountDetails;
