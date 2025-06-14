import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMinus } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { useCartContext } from '../context/CartContext';
import Spinner from '../components/Spinner';

const CartItem = ({ product }) => {
	const { updateCartItem, removeCartItem } = useCartContext();
	const handleQuantityChange = (e) => {
		const newQuantity = parseInt(e.target.value);
		if (newQuantity >= 1) {
			updateCartItem(product, newQuantity);
		}
	};
	const increaseQuantity = () => {
		updateCartItem(product, product.quantity + 1);
	};
	const decreaseQuantity = () => {
		updateCartItem(product, product.quantity - 1);
	};
	const removeFromCart = () => {
		removeCartItem(product);
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
		<li className="py-3 px-2 sm:py-5 sm:px-6 border-b border-b-gray-100">
			<div className="flex gap-2 sm:gap-4">
				<div className="relative">
					<figure className="bg-white border rounded-lg size-20 sm:size-28 p-2 sm:p-3">
						<Link>
							<img
								src={getItemImage(product)}
								alt={`Ürün görseli: ${product.productVendor.product.name}`}
								className="size-full object-contain"
							/>
						</Link>
					</figure>
				</div>
				<div className="w-full flex flex-col justify-between">
					<div className="w-full">
						<div className="font-semibold text-sm text-neutral-800 my-1 overflow-hidden">
							<Link to="/">{product.productVendor.product.name}</Link>
						</div>
						{/* <div className="text-xs text-neutral-600 mb-4">
							{product.name?.split(' - ')[1]}
						</div> */}
					</div>
					<div className="flex items-center justify-between relative">
						<div className="h-8 bg-white border rounded-full flex justify-between">
							<Link
								to=""
								className="flex items-center justify-center w-8 hover:bg-orange-100 rounded-full p-2"
								onClick={
									product.quantity === 1 ? removeFromCart : decreaseQuantity
								}
							>
								{product.quantity === 1 ? (
									<FaTrash className="text-orange-500 text-sm" />
								) : (
									<FaMinus className="text-orange-500 text-sm" />
								)}
								{/* <FaMinus className="text-orange-500 text-sm" /> */}
							</Link>
							<input
								type="number"
								name="quantity"
								value={product.quantity}
								onChange={handleQuantityChange}
								className="bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-orange-500 w-6 text-center font-semibold text-sm"
							/>
							<Link
								href=""
								className="flex items-center justify-center w-8 hover:bg-orange-100 rounded-full p-2"
								onClick={increaseQuantity}
							>
								<FaPlus className="text-orange-500 text-sm" />
							</Link>
						</div>
						<div className="text-base font-semibold">{product.price} TL</div>
					</div>
				</div>
			</div>
		</li>
	);
};

const ProductCart = ({ seller, items }) => {
	return (
		<div className="bg-white mb-4">
			<div className="border-b flex justify-between items-center min-h-11 py-3 px-2 sm:py-5 sm:px-6">
				<div className="text-neutral-800">
					<span className="text-xs leading-5 font-normal">Satıcı:</span>
					<span className="text-sm font-medium ml-0.5">
						<Link to="/">{seller}</Link>
					</span>
				</div>
			</div>
			<ul>
				{items.map((item) => (
					<CartItem key={item._id} product={item} />
				))}
			</ul>
		</div>
	);
};

const Cart = () => {
	const { cart, isLoading, clearCart } = useCartContext();
	const navigate = useNavigate();

	if (isLoading || !cart || !Array.isArray(cart.items)) {
		return (
			<div className="h-screen w-screen">
				<Spinner />
			</div>
		);
	}

	if (cart.items.length === 0) {
		return (
			<div className="h-screen w-full flex items-center justify-center">
				<p className="text-neutral-600 text-lg">Sepetiniz boş.</p>
			</div>
		);
	}

	const sellers = [
		...new Set(cart.items.map((item) => item.productVendor.vendor.storeName)),
	];

	return (
		<>
			<div>
				<div className="h-14 border-b shadow bg-white px-4">
					<header className="flex justify-between items-center max-w-[75rem] mx-auto w-full h-full">
						<div className="flex items-center gap-2">
							<h1 className="font-semibold text-2xl tracking-tight leading-none text-neutral-800">
								Sepetim
							</h1>
							<span className="text-neutral-500 text-lg font-normal leading-none ">
								({cart.items.length} ürün)
							</span>
						</div>
						<div
							className="text-sm font-semibold text-orange-500 cursor-pointer"
							onClick={clearCart}
						>
							Ürünleri sil
						</div>
					</header>
				</div>
				<div className="bg-neutral-100 h-screen px-4">
					<div className="sm:max-w-[75rem] mx-auto flex flex-col sm:flex-row flex-1 pt-4">
						<div className="w-full">
							<section>
								{sellers.map((seller) => {
									const sellerItems = cart.items.filter(
										(item) => item.productVendor.vendor.storeName === seller
									);
									return (
										<ProductCart
											key={seller}
											seller={seller}
											items={sellerItems}
										/>
									);
								})}
							</section>
						</div>
						<div className="sm:max-w-56 w-full sm:ml-5 max-sm:pb-16">
							<div className=" bg-white sm:sticky sm:top-8 border rounded-lg pt-6 pb-4 px-5 flex flex-col">
								<div className="flex flex-col">
									<span className="text-sm font-semibold text-orange-500 mb-1">
										SEÇİLEN ÜRÜNLER ({cart.items.length})
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
										onClick={() => navigate('/odeme')}
									>
										Alışverişi tamamla
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

export default Cart;
