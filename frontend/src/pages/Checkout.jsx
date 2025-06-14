import React, { useState } from 'react';
import { AddressList } from '../components/AddressList';
import { useAuth } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';
import Spinner from '../components/Spinner.jsx';
import { MdModeEdit, MdOutlineAdd } from 'react-icons/md';
import { AddressCard } from '../components/AddressCard';
import { Link } from 'react-router-dom';
import { FaMinus } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';

const Checkout = () => {
	const { userAddresses } = useAuth();
	const { cart, isLoading, clearCart } = useCartContext();
	const [selectedAddress, setSelectedAddress] = useState(null);

	if (isLoading || !cart || !Array.isArray(cart.items)) {
		return (
			<div className="h-screen w-screen">
				<Spinner />
			</div>
		);
	}

	const handleOrderSubmit = async () => {
		try {
			if (!selectedAddress) {
				alert('Lütfen bir teslimat adresi seçin.');
				return;
			}

			const response = await axios.post(
				'http://localhost:5000/api/order/create',
				{ addressId: selectedAddress },
				{ withCredentials: true }
			);

			if (response.status >= 200 && response.status < 300) {
				console.log('siparis verildi');
				// navigate('/order-success');
			} else {
				console.error('Sipariş oluşturulamadı:');
			}
		} catch (err) {
			console.error('Sunucu hatası:', err);
		}
	};

	const getItemImage = (item) => {
		const productImages = item.productVendor.product.images || [];
		const vendorImages = item.productVendor.vendorImages || [];
		const allImages = [...productImages, ...vendorImages];
		const imagesToShow =
			allImages.length > 0
				? `http://localhost:5000${allImages[0]}`
				: 'https://placehold.co/424x600';

		return imagesToShow;
	};

	return (
		<>
			<div>
				<div className="bg-neutral-100 h-screen px-4">
					<div className="sm:max-w-[75rem] mx-auto flex flex-col sm:flex-row flex-1 pt-4">
						<div className="w-full">
							<section>
								<div className="bg-white mb-4">
									<div className="border-b flex justify-between items-center min-h-11 py-3 px-2 sm:py-[13px] sm:px-6">
										<div className="text-neutral-800 font-semibold">
											Teslimat adresim
										</div>
										<button
											className="flex items-center gap-2 border border-orange-500 hover:border-orange-600 rounded-lg p-2 text-orange-500 hover:text-orange-600 text-sm font-semibold transition-all"
											// onClick={handleAddAddress}
										>
											<MdOutlineAdd className="text-xl" />
											Adres ekle
										</button>
									</div>
									<div className="p-4">
										<div className="flex gap-4 flex-wrap">
											{userAddresses === undefined ? (
												<div className="text-center flex flex-col gap-2">
													<Spinner />
													<span>Adresler yükleniyor...</span>
												</div>
											) : userAddresses.length === 0 ? (
												<div>Kayıtlı adres bulunamadı.</div>
											) : (
												userAddresses.map((address) => (
													<div
														key={address._id}
														className="w-96 cursor-pointer"
														onClick={() => {
															setSelectedAddress(address._id);
														}}
													>
														<AddressCard
															address={address}
															// onEditClick={handleEditModal}
															// onDeleteClick={handleDeleteModal}
															selectedId={selectedAddress}
														/>
													</div>
												))
											)}
										</div>
									</div>
								</div>
							</section>
							<section>
								<div className="bg-white mb-4">
									<div className="border-b flex justify-between items-center min-h-11 py-3 px-2 sm:py-5 sm:px-6">
										<div className="text-neutral-800 font-semibold">
											Ödeme yöntemi
										</div>
									</div>
								</div>
							</section>
							<section>
								<div className="bg-white mb-4">
									<div className="border-b flex justify-between items-center min-h-11 py-3 px-2 sm:py-5 sm:px-6">
										<div className="text-neutral-800 font-semibold">
											Teslim edilecek ürün/ürünler
										</div>
									</div>
									<div className="p-4">
										<ul className="flex flex-wrap gap-4">
											{cart.items.map((item) => {
												return (
													<li
														className=" border border-zinc-300 p-2 rounded-lg max-w-80 w-full"
														key={item._id}
													>
														<div className="flex gap-2 sm:gap-4 items-center">
															<div>
																<figure className="bg-white border rounded-lg size-14 sm:size-11">
																	<Link>
																		<img
																			src={getItemImage(item)}
																			alt={`Ürün görseli: ${item.productVendor.product.name}`}
																			className="size-full object-contain"
																		/>
																	</Link>
																</figure>
															</div>
															<div className="w-full flex flex-col justify-between">
																<div className="w-full">
																	<div className="font-semibold text-sm text-neutral-800 my-1 overflow-hidden">
																		<Link
																			to={`/${item.productVendor.product.slug}`}
																		>
																			{item.productVendor.product.name}
																		</Link>
																	</div>
																</div>
															</div>
														</div>
													</li>
												);
											})}
										</ul>
									</div>
								</div>
							</section>
						</div>
						<div className="sm:max-w-56 w-full sm:ml-5 max-sm:pb-16">
							<div className=" bg-white sm:sticky sm:top-8 border rounded-lg pt-6 pb-4 px-5 flex flex-col">
								<div className="flex flex-col">
									<span className="text-sm font-semibold text-orange-500 mb-1">
										Ödenecek tutar
									</span>
									<span className="mb-2">
										<span className="text-3xl leading-10 font-semibold text-neutral-800">
											{cart.totalPrice}
										</span>
										<span className="text-xl leading-9 font-semibold text-neutral-800 ml-0.5">
											TL
										</span>
									</span>
									<button
										className=" text-base font-semibold h-12 w-full bg-orange-500 text-white rounded-lg py-1 hover:bg-orange-700 transition-all"
										onClick={handleOrderSubmit}
									>
										Siparişi onayla
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Checkout;
