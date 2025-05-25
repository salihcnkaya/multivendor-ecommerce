import React, { useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import axios from 'axios';
import { ProductModal } from '../components/ProductModal';
import { useProductContext } from '../context/ProductContext';

const AddProduct = () => {
	const [query, setQuery] = useState('');
	const [products, setProducts] = useState([]);
	const [message, setMessage] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(undefined);
	const [searchFailed, setSearchFailed] = useState(false);

	const { addProduct } = useProductContext();

	const handleSearch = async () => {
		try {
			const response = await axios.get(
				'http://localhost:5000/api/products/search',
				{
					params: { search: query },
				}
			);

			if (
				Array.isArray(response.data.products) &&
				response.data.products.length > 0
			) {
				setProducts(response.data.products);
				setMessage('');
				setSearchFailed(false);
			} else {
				setMessage('Ürün bulunamadı.');
				setProducts([]);
				setSearchFailed(false);
			}
		} catch (error) {
			if (error.response && error.response.status === 404) {
				setMessage('Ürün bulunamadı.');
				setProducts([]);
				setSearchFailed(true);
			} else {
				setMessage('Bir hata oluştu');
				setProducts([]);
				setSearchFailed(false);
			}
		}
	};

	const handleModal = (product) => {
		setSelectedProduct(product);
		setIsModalOpen(true);
	};

	const handleSubmit = (formData) => {
		addProduct(formData);
	};

	return (
		<div className="m-4 flex flex-col sm:items-center sm:justify-center gap-4">
			<div className="flex flex-col gap-4 border rounded-lg p-8 sm:w-5/6">
				<div className="max-w-96 space-y-2">
					<div className="text-2xl sm:text-3xl font-bold text-neutral-800">
						Ürün girmek ve satışa açmak çok kolay!
					</div>
					<div className="text-base sm:text-lg text-neutral-800">
						Hepsiburada kataloğunda ürünleri arayıp satışa açabilir, ürününüz
						katalogda yok ise ürün ekle butonu ile yeni ürün girebilirsiniz!
					</div>
				</div>
				<div className="max-w-xl">
					<div className=" relative max-sm:flex max-sm:flex-col gap-4">
						<div className="relative">
							<IoSearchSharp className="absolute top-1/2 -translate-y-1/2 text-xl text-gray-800 left-3" />
							<input
								type="text"
								placeholder="Ürün, kategori veya markaları ara"
								className="border border-orange-500 rounded-md outline-none pl-10 pr-2 w-full h-12 text-sm placeholder:text-gray-800"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
						</div>
						<button
							className="sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:right-2 text-base font-semibold max-w-16 w-full bg-orange-500 text-white rounded py-1 hover:bg-orange-700 transition-all"
							onClick={handleSearch}
						>
							Ara
						</button>
					</div>
				</div>
			</div>
			<div className="sm:w-5/6">
				{message && <p>{message}</p>}
				{products.length > 0 ? (
					<div>
						<h3 className="mb-2">Bulunan Ürünler:</h3>
						<ul className="flex gap-2 flex-wrap">
							{products.map((product) => (
								<li
									key={product._id}
									className="mb-4 border rounded-lg p-4 w-full sm:max-w-80"
								>
									<div className="font-bold text-lg text-neutral-800">
										{product.name}
									</div>
									<div className="text-sm text-neutral-700 line-clamp-2">
										{product.description}
									</div>
									<div className="mt-2 text-sm text-gray-800">
										Kategori: {product.category}
									</div>
									<button
										className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 mt-2 transition-all"
										onClick={() => handleModal(product)}
									>
										Satışa Aç
									</button>
								</li>
							))}
						</ul>
					</div>
				) : (
					searchFailed && (
						<div className="flex justify-start mt-4">
							<button
								className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 transition-all"
								onClick={() => setIsModalOpen(true)}
							>
								Ürün Ekle
							</button>
						</div>
					)
				)}
				{isModalOpen && (
					<ProductModal
						isOpen={isModalOpen}
						onClose={() => {
							setIsModalOpen(false);
							setSelectedProduct(undefined);
						}}
						selectedProduct={selectedProduct}
						onSubmit={handleSubmit}
					/>
				)}
			</div>
		</div>
	);
};

export default AddProduct;
