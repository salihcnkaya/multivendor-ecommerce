import React, { useEffect, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { useProductContext } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import { IoMdCheckmark } from 'react-icons/io';
import { LuX } from 'react-icons/lu';

const OrderItem = ({ order }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { approveProduct } = useProductContext();

	const getItemImage = (item) => {
		const productImages = item.images || [];
		const allImages = [...productImages];
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
				<div className="flex flex-col sm:flex-row sm:items-center gap-4">
					<div className="flex flex-col leading-4">
						<p className="font-semibold">
							Kategori: <span className="font-normal">{order.category}</span>
						</p>
						<p className="font-semibold">
							Slug: <span className="font-normal">{order.slug}</span>
						</p>
					</div>
					<div className="flex items-center gap-4">
						<img
							src={getItemImage(order)}
							alt=""
							className="size-16 object-contain"
						/>
						<p className="sm:max-w-64 truncate font-semibold">{order.name}</p>
					</div>
				</div>
				<div className="flex justify-between items-center gap-2">
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
				<>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between max-w-7xl w-full text-neutral-700 p-5">
						<div className="flex flex-col gap-2 w-full">
							<div className="flex gap-4">
								<div className="border-l p-2">
									<p className="font-semibold">Ekleme Tarihi</p>
									<span>
										{new Date(order.createdAt).toLocaleDateString(undefined, {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})}
									</span>
								</div>
								<div className="border-l p-2">
									<p className="font-semibold">Ekleme İsteği Yapan Mağaza</p>
									<span>
										<Link to={`/magaza/${order.requestFrom.slug}`}>
											{order.requestFrom.storeName}
										</Link>
									</span>
								</div>
							</div>
							<div className="border-l p-2">
								<p className="font-semibold">Ürün Açıklaması</p>
								<span>{order.description}</span>
							</div>
							<div className="flex w-full justify-end items-end gap-2">
								<button
									className="flex items-center gap-0.5 bg-orange-500 hover:bg-orange-600 p-2 text-sm text-white font-semibold rounded transition-all"
									onClick={() => {
										approveProduct(order.slug);
									}}
								>
									<IoMdCheckmark className="text-2xl" />
									Onayla
								</button>
								<button
									className="flex items-center gap-0.5 bg-orange-500 hover:bg-orange-600 p-2 text-sm text-white font-semibold rounded transition-all"
									onClick={() => onDeleteClick(product)}
								>
									<LuX className="text-2xl" />
									Sil
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

const ApproveProduct = () => {
	const { unapprovedProducts, fetchUnapprovedProducts } = useProductContext();

	useEffect(() => {
		fetchUnapprovedProducts();
	}, []);

	if (unapprovedProducts === null || unapprovedProducts.length === 0) {
		return (
			<div className="m-4 flex flex-col sm:items-center sm:justify-center gap-4">
				<span>Onaylanacak ürün bulunamadı.</span>
			</div>
		);
	}

	return (
		unapprovedProducts && (
			<div className="m-4 flex flex-col sm:items-center sm:justify-center gap-4">
				{unapprovedProducts.map((product) => (
					<OrderItem key={product._id} order={product} />
				))}
			</div>
		)
	);
};

export default ApproveProduct;
