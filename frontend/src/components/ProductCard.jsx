import React from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
	const { addToCart } = useCartContext();

	return (
		<div className="max-w-80 w-full bg-white border rounded-xl overflow-hidden">
			<Link to={`${product.slug}`} className="flex flex-col gap-2 mb-4">
				<img
					src="https://productimages.hepsiburada.net/s/131/200-200/110000082161536.jpg/format:webp"
					alt=""
					className="w-full h-64 object-cover"
				/>
				<div className="px-2 flex flex-col gap-2">
					<span className="text-sm line-clamp-2 leading-4 font-semibold text-gray-700">
						{product.name}
					</span>
					<span className="text-sm leading-4 font-bold text-green-700">
						{product.defaultVendor.price}
					</span>
				</div>
			</Link>
			<div className="px-2 mb-3">
				<button
					className="w-full bg-orange-500 text-white font-semibold rounded-lg py-1 hover:bg-orange-700 transition-all"
					onClick={() => addToCart(product)}
				>
					Sepete ekle
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
