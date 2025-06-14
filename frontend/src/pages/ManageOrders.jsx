import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MdExpandMore } from 'react-icons/md';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

const OrderItem = ({ order }) => {
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
	const [isOpen, setIsOpen] = useState(false);

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
								className="size-11 object-contain border rounded-full"
								alt={`Ürün görseli: ${item.productVendor.product.name}`}
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
						<p className="text-neutral-500">Toplam Tutar</p>
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
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between max-w-7xl w-full text-neutral-700 p-5">
					<div className="flex flex-col gap-2">
						<div className="flex gap-4">
							<div className="border-l p-2">
								<p className="font-semibold">Siparis Tarihi</p>
								<span>
									{new Date(order.createdAt).toLocaleDateString(undefined, {
										day: '2-digit',
										year: 'numeric',
										month: 'long',
									})}
								</span>
							</div>
							<div className="border-l p-2">
								<p className="font-semibold">Teslim Alacak Kisi</p>
								<span>{`${order.user.name} ${order.user.surname}`}</span>
							</div>
						</div>
						<div className="border-l p-2">
							<p className="font-semibold">Ürün bilgileri</p>
							{order.items.map((item, index) => {
								return (
									<Link
										key={index}
										to={`/${item.productVendor.product.slug}`}
										className="block my-1 hover:text-orange-500 transition-all"
										target="_blank"
										rel="noopener noreferrer"
									>
										{item.productVendor.product.name} - {item.quantity} adet
									</Link>
								);
							})}
						</div>
						<div className="border-l p-2">
							<p className="font-semibold">Adres Bilgisi</p>
							<span>
								{`${order.address.address}, ${order.address.buildingNo}/${order.address.apartmentNo}, ${order.address.district} / ${order.address.city} / ${order.address.country}, ${order.address.phoneNumber}`}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const ManageOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState();

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				const response = await axios.get(
					'http://localhost:5000/api/vendor/orders',
					{
						withCredentials: true,
					}
				);
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
		<div className="m-4 flex flex-col sm:items-center sm:justify-center gap-4">
			{orders.length === 0 && <div className="">No siparis no cartcurt</div>}
			{orders.map((order) => (
				<OrderItem key={order._id} order={order} />
			))}
		</div>
	);
};

export default ManageOrders;
