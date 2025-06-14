import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { FaBox } from 'react-icons/fa';

import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AddressCard } from '../components/AddressCard';

const groupByVendor = (items) => {
	const grouped = {};

	items.forEach((item) => {
		const vendorKey = item.vendor.slug;
		if (!grouped[vendorKey]) {
			grouped[vendorKey] = {
				vendor: item.vendor,
				items: [],
			};
		}
		grouped[vendorKey].items.push(item);
	});

	return Object.values(grouped);
};

const OrderItem = ({ order }) => {
	const [isOpen, setIsOpen] = useState(false);

	console.log(order);

	const getItemImage = (item) => {
		const vendorImages = item.productVendor.vendorImages || [];
		const productImages = item.productVendor.product.images || [];
		const allImages = [...productImages, ...vendorImages];
		const imagesToShow =
			allImages.length > 0
				? `http://localhost:5000${allImages[0]}`
				: 'https://placehold.co/424x600';

		return imagesToShow;
	};

	return (
		<div
			className={`max-w-7xl w-full border rounded-md text-sm ${
				isOpen ? 'shadow-md' : ''
			}`}
		>
			<div
				className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between max-w-7xl w-full text-neutral-700 p-5 ${
					isOpen ? 'border-b' : ''
				}`}
			>
				<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-10">
					<div className="flex items-center gap-1 w-36">
						{order.items.slice(0, 2).map((item, index) => (
							<img
								key={index}
								src={getItemImage(item)}
								className="size-11 p-1 object-contain border rounded-full"
								alt={`Ürün ${index + 1}`}
							/>
						))}

						{order.items.length > 2 && (
							<div className="size-11 flex items-center justify-center border border-orange-500 rounded-full text-sm font-semibold text-gray-700">
								+{order.items.length - 2}
							</div>
						)}
					</div>
					<div className="leading-4 max-w-52">
						<p className="font-normal text-neutral-500">
							Siparis No: <span className="font-bold">478 014 204 7</span>
						</p>
					</div>
					<div className="leading-4 max-w-52">
						<p className="font-normal text-neutral-500">
							Sipariş Durumu: <span className="font-bold">İşleniyor</span>
						</p>
					</div>
				</div>
				<div className="flex justify-between items-center gap-2">
					<div className="sm:text-right leading-4">
						<p className="text-neutral-500">
							{new Date(order.createdAt).toLocaleDateString(undefined, {
								day: '2-digit',
								year: 'numeric',
								month: 'long',
							})}
						</p>
						<span className="font-semibold text-base">
							{order.totalPrice} TL
						</span>
					</div>
					<button
						className={`hover:text-orange-500 transition-all transform ${
							isOpen ? 'rotate-180' : ''
						} `}
						onClick={() => {
							setIsOpen((prevState) => !prevState);
						}}
					>
						<MdExpandMore className="text-2xl" />
					</button>
				</div>
			</div>

			{isOpen && (
				<div className="flex flex-col gap-4 text-neutral-700 p-5">
					{groupByVendor(order.items).map((group, index) => (
						<div key={index} className="w-full border rounded-md text-sm">
							<div className="py-4 px-3 border-b">
								<div className="text-sm text-neutral-700">
									Satıcı:{' '}
									<Link
										to={`/${group.vendor.slug}`}
										className="font-bold text-blue-500"
									>
										{group.vendor.storeName}
									</Link>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row sm:justify-between">
								<div className="flex-1 p-4">
									<div className="flex flex-col gap-8">
										{group.items.map((item, idx) => (
											<div
												key={idx}
												className="flex flex-row justify-start flex-wrap gap-4"
											>
												<Link to={`/${item.productVendor.product.slug}`}>
													<img
														src={getItemImage(item)}
														className="size-16 object-contain"
													/>
												</Link>
												<div className="text-xs flex-1">
													<div className="flex flex-col gap-2">
														<Link to={`/${item.productVendor.product.slug}`}>
															{item.productVendor.product.name} -{' '}
															{item.quantity} adet
														</Link>
														<span className="font-semibold text-sm text-green-600">
															{item.price} TL
														</span>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
								<div className="flex-1 bg-green-50">
									<div className="p-4 ">
										<div className="flex items-center gap-4">
											<div className="inline-flex items-center justify-center w-12 h-12 bg-green-400 rounded-full">
												<FaBox className="text-white text-2xl" />
											</div>
											<div className="text-sm">
												Teslimat:{' '}
												<span className="font-semibold">İşleniyor</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
					<div className="border rounded-md text-sm sm:w-1/2">
						<div className="py-4 px-3 border-b">
							<div className="text-sm text-neutral-700">
								<h5>Teslimat Adresi</h5>
							</div>
						</div>
						<div className="flex flex-col sm:flex-row sm:justify-between">
							<div className="p-4 w-full">
								<AddressCard
									address={order.address}
									// onEditClick={handleEditModal}
									// onDeleteClick={handleDeleteModal}
									// selectedId={selectedAddress}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const MyOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState();

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				const response = await axios.get('http://localhost:5000/api/order', {
					withCredentials: true,
				});
				setOrders(response.data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	if (loading) {
		return (
			<div className="h-screen w-screen">
				<Spinner />
			</div>
		);
	}

	return (
		<>
			<div className="h-14 border-b shadow bg-white px-4">
				<header className="flex justify-between items-center max-w-[75rem] mx-auto w-full h-full">
					<div className="flex items-center gap-2">
						<h1 className="font-semibold text-2xl tracking-tight leading-none text-neutral-800">
							Siparişlerim
						</h1>
					</div>
				</header>
			</div>
			<div className="m-4 flex flex-col sm:items-center sm:justify-center gap-4 max-sm:pb-16">
				{orders.length === 0 && <div className="">No siparis no cartcurt</div>}
				{orders.map((order) => (
					<OrderItem key={order._id} order={order} />
				))}
			</div>
		</>
	);
};

export default MyOrders;
