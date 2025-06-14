import React, { useEffect, useState } from 'react';
import {
	Link,
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import { MdAddShoppingCart } from 'react-icons/md';
import ImageCarousel from '../components/ImageCarousel';
import { useProductContext } from '../context/ProductContext';
import Spinner from '../components/Spinner';
import { useCartContext } from '../context/CartContext';

const ProductDetails = () => {
	const { slug } = useParams();
	const [searchParams] = useSearchParams();
	const { productDetails, fetchProductDetails, loading, error } =
		useProductContext();
	const { addToCart } = useCartContext();
	const storeSlug = searchParams.get('magaza');
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		fetchProductDetails(slug, storeSlug);
	}, [slug, storeSlug]);

	const [tab, setTab] = useState('aciklama');

	const tabHandler = (tabName) => {
		setTab(tabName);
	};

	if (error === 'Ürün bulunamadı') {
		return (
			<div className="h-screen w-screen flex justify-center items-center">
				<p>Ürün bulunamadı. Lütfen başka bir ürün deneyin.</p>
			</div>
		);
	}

	if (loading || !productDetails || !productDetails.product) {
		return (
			<div className="h-screen w-screen">
				<Spinner />
			</div>
		);
	}

	const handleStoreChange = (storeName) => {
		const currentUrl = location.pathname;
		const newUrl = `${currentUrl}?magaza=${storeName}`;
		navigate(newUrl);
	};

	const productImages = productDetails.product.images || [];
	const vendorImages = productDetails.defaultVendor.vendorImages || [];
	const allImages = [...productImages, ...vendorImages];
	const imagesToShow =
		allImages.length > 0
			? `http://localhost:5000${allImages[0]}`
			: 'https://placehold.co/424x600';

	return (
		<div className="max-w-[82.5rem] mx-auto mt-12 px-4 max-sm:mb-16 mb-4">
			<section className="flex flex-col max-sm:items-center sm:flex-row justify-between gap-8 text-neutral-800">
				<div>
					<ImageCarousel images={allImages} />
				</div>
				<div className="sm:w-[37.625rem]">
					<div>
						<h1 className="text-lg leading-6 font-semibold text-neutral-800">
							{productDetails.product.name}
						</h1>
					</div>
					<div className="mt-4">
						<div className=" flex items-center border rounded h-8 p-1 w-max">
							<span className="text-sm leading-4 font-bold text-neutral-500">
								Satıcı:
							</span>
							<Link to="/">
								<span className="text-orange-500 text-sm font-bold uppercase ml-1">
									{productDetails.defaultVendor.vendor.storeName}
								</span>
							</Link>
						</div>
					</div>
					<div className="flex flex-row h-10 mt-4">
						<div className="flex flex-col">
							<div className="flex items-center">
								<div className="text-2xl leading-10 font-bold text-neutral-800">
									<span>{productDetails.defaultVendor.price} TL</span>
								</div>
							</div>
						</div>
					</div>
					<div className="flex h-12 mt-4">
						<button
							className="flex items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-600 transition-all text-base font-semibold h-12 p-2 max-w-96 min-w-40 w-full text-white"
							onClick={() => addToCart(productDetails)}
						>
							<MdAddShoppingCart className="size-6" />
							Sepete ekle
						</button>
					</div>
				</div>

				<div className="w-full sm:w-[14.375rem]">
					<div className=" bg-white border rounded-lg pt-3 flex flex-col">
						<div className="flex items-baseline justify-between px-4 pb-2 border-b border-gray-100">
							<span className="text-xs font-semibold tracking-tighting">
								Diğer Satıcılar
							</span>
						</div>
						{productDetails.otherVendors &&
						productDetails.otherVendors.length > 0 ? (
							<div className="flex flex-col">
								<div className="border-b border-gray-100 py-3">
									<div className="px-3">
										{productDetails.otherVendors.map((vendor, index) => (
											<div key={index} className="mb-2">
												{/* Satıcı Adı */}
												<Link
													to={`/satici/${vendor.vendor.slug}`}
													className="text-orange-500 text-xs font-semibold tracking-tight"
												>
													{vendor.vendor.storeName}
												</Link>
												{/* Satıcı Fiyatı */}
												<div className="flex items-center justify-between mt-2">
													<div className="text-sm font-bold">
														{vendor.price} TL
													</div>
													{/* Satıcıya git butonu */}
													<button
														className="border rounded-lg flex items-center justify-center text-xs font-medium h-8 min-w-20 w-24 p-2 hover:border-orange-500 hover:text-orange-500 transition-all"
														onClick={() =>
															handleStoreChange(vendor.vendor.storeName)
														}
													>
														Ürüne git
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						) : (
							<div className="flex flex-col">
								<div className="p-3">
									<p className="text-sm font-semibold tracking-tight leading-4">
										Bu urun baska saticida bulunmuyor!
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</section>
			<section className="border rounded-lg mt-8 text-neutral-800">
				<div className="flex items-center border-b max-sm:flex-col">
					<button
						className={`flex flex-auto items-center justify-center text-xs h-12 min-w-48 relative  ${
							tab === 'aciklama' ? 'bottom-line font-semibold' : 'font-normal'
						}`}
						onClick={() => tabHandler('aciklama')}
					>
						Ürün Açıklaması
					</button>
					<button
						className={`flex flex-auto items-center justify-center text-xs h-12 min-w-48 relative  ${
							tab === 'degerlendirme'
								? 'bottom-line font-semibold'
								: 'font-normal'
						}`}
						onClick={() => tabHandler('degerlendirme')}
					>
						Değerlendirmeler
					</button>
					<button
						className={`flex flex-auto items-center justify-center text-xs h-12 min-w-48 relative  ${
							tab === 'taksit' ? 'bottom-line font-semibold' : 'font-normal'
						}`}
						onClick={() => tabHandler('taksit')}
					>
						Kredi Kart Taksitleri
					</button>
					<button
						className={`flex flex-auto items-center justify-center text-xs h-12 min-w-48 relative  ${
							tab === 'iade' ? 'bottom-line font-semibold' : 'font-normal'
						}`}
						onClick={() => tabHandler('iade')}
					>
						İptal ve İade Koşulları
					</button>
				</div>
				<div>
					<div className="p-6">
						<div>
							<div className="py-1 px-4 text-sm text-neutral-700">
								<h3 className="text-base leading-5 font-bold mb-1">
									{productDetails.product.name}
								</h3>
								<p className="leading-4 ">
									{productDetails.product.description}
								</p>
							</div>
							<div className="mt-4">
								<div className="text-xl font-semibold my-4 text-neutral-700">
									Ürün Özellikleri
								</div>
								<div className="flex flex-wrap justify-between gap-y-2">
									<div className="bg-zinc-100 rounded flex items-center justify-between py-3 px-4 w-[38rem] text-xs">
										<div>Siklon Filtre</div>
										<div>Yok</div>
									</div>
									<div className="bg-zinc-100 rounded flex items-center justify-between py-3 px-4 w-[38rem] text-xs">
										<div>Siklon Filtre</div>
										<div>Yok</div>
									</div>
								</div>
								<div className="text-xl font-semibold my-4 text-neutral-700">
									Diğer
								</div>
								<div className="flex flex-wrap justify-between gap-y-2">
									<div className="bg-zinc-100 rounded flex items-center justify-between py-3 px-4 w-full text-xs">
										<div>Garanti Süresi</div>
										<div>24 ay</div>
									</div>
									<div className="bg-zinc-100 rounded flex items-center justify-between py-3 px-4 w-full text-xs">
										<div>Yurt Dışı Satışı</div>
										<div>Yok</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ProductDetails;
