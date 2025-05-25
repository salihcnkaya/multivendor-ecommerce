import { IoSearchSharp } from 'react-icons/io5';
import { FaShoppingCart } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import { BiSolidCategory } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import HoverMenu from './HoverMenu';
import { useProductContext } from '../context/ProductContext';
import { useEffect, useState } from 'react';
const SearchBar = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const { searchProducts, searchResults, clearSearchResults } =
		useProductContext();

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			if (searchTerm.trim() !== '') {
				searchProducts(searchTerm);
			}
		}, 500);

		return () => clearTimeout(delayDebounce);
	}, [searchTerm]);

	return (
		<div className="relative">
			<IoSearchSharp className="absolute top-1/2 -translate-y-1/2 text-xl text-gray-800 left-3" />
			<input
				type="text"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder="Ürün, kategori veya markaları ara"
				className="border border-orange-500 rounded-md outline-none pl-10 pr-2 w-full h-12 text-sm placeholder:text-gray-800"
			/>
			{searchTerm && searchResults.length > 0 && (
				<ul className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
					{searchResults.map((searchResult) => (
						<li
							key={searchResult._id}
							className="px-4 py-2 hover:bg-orange-100 text-sm cursor-pointer"
						>
							<Link
								to={`/${searchResult.slug}`}
								onClick={() => {
									setSearchTerm('');
									clearSearchResults();
								}}
							>
								{searchResult.name}
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

const BottomNav = () => (
	<div className="sm:hidden px-4 fixed bottom-0 w-full border-t border-l-gray-500 bg-white z-10">
		<div className="flex justify-between max-w-sm mx-auto items-center py-2">
			<Link
				to="/"
				className="flex flex-col items-center  text-sm text-gray-700 hover:text-gray-900 transition-all"
			>
				<FaHome className="text-xl" />
				Ana Sayfa
			</Link>
			<Link
				to="/"
				className="flex flex-col items-center gap-1 text-sm text-gray-700 hover:text-gray-900 transition-all"
			>
				<FaShoppingCart className="text-xl" />
				Sepet
			</Link>
			<Link
				to="/"
				className="flex flex-col items-center gap-1 text-sm text-gray-700 hover:text-gray-900 transition-all"
			>
				<FaUser className="text-xl" />
				Hesabım
			</Link>
			<Link
				to="/"
				className="flex flex-col items-center gap-1 text-sm text-gray-700 hover:text-gray-900 transition-all"
			>
				<BiSolidCategory className="text-xl" />
				Kategoriler
			</Link>
		</div>
	</div>
);

const Navbar = () => {
	return (
		<>
			<nav className="container mx-auto px-4 my-4">
				{/* Mobil görünüm */}
				<div className="sm:hidden flex flex-col gap-3">
					<div>
						<Link to="/" className="text-2xl font-bold text-orange-600">
							hepsiburada
						</Link>
					</div>

					<SearchBar />
				</div>

				{/* Masaüstü görünümü */}
				<div className="hidden sm:flex flex-row items-center gap-8 justify-between h-14">
					<div>
						<Link to="/" className="text-3xl font-bold text-orange-600">
							hepsiburada
						</Link>
					</div>

					<div className="flex-1 max-w-2xl">
						<SearchBar />
					</div>

					<div className="flex gap-2">
						{/* <Link to="auth/giris-yap" className="flex">
							<button className="bg-zinc-500 text-white px-6 py-2 rounded flex items-center gap-2">
								<FaUser />
								Giriş Yap
							</button>
						</Link> */}
						<HoverMenu />

						<Link to="/sepet" className="flex">
							<button className="bg-zinc-500 text-white px-6 py-3 rounded flex items-center gap-2">
								<FaShoppingCart />
								Sepet
							</button>
						</Link>
					</div>
				</div>
			</nav>

			{/* Alt menülerin (bars) responsive uyumlu olması */}
			<div className="flex w-full">
				<div className="flex-1 h-2 bg-orange-500"></div>
				<div className="flex-1 h-2 bg-blue-500"></div>
				<div className="flex-1 h-2 bg-purple-900"></div>
				<div className="flex-1 h-2 bg-green-500"></div>
			</div>

			<BottomNav />
		</>
	);
};

export default Navbar;
