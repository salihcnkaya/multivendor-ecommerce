import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const HoverMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { user, logout } = useAuth();

	const navigate = useNavigate();

	return (
		<div
			className="relative"
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			<button
				className=" border-2 border-zinc-500 hover:bg-zinc-500  text-zinc-500 hover:text-white font-semibold px-6 py-3 rounded flex items-center gap-2 w-full h-full transition-all"
				onClick={() => navigate('/auth/giris-yap')}
			>
				<FaUser />
				{user ? user.name : 'Giriş Yap'}
			</button>

			{isOpen && user && (
				<div className="absolute right-0 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
					<Link
						to="/uyelik-bilgilerim"
						className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
					>
						Üyelik Bilgilerim
					</Link>
					<Link
						to="/siparislerim"
						className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
					>
						Siparişlerim
					</Link>
					{user && (
						<button
							className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
							onClick={() => logout('user')}
						>
							Çıkış Yap
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default HoverMenu;
