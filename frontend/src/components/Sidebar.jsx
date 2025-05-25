import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IoMenu, IoClose } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isMenuOpen, toggleMenu }) => {
	const { logout, user } = useAuth();

	const handleLogout = () => {
		logout(user.role);
		toggleMenu();
	};

	const renderMenuItems = () => {
		if (user.role === 'vendor') {
			return (
				<>
					<li>
						<NavLink
							to="urun-ekle"
							className={({ isActive }) =>
								isActive
									? 'block py-2 px-4 rounded bg-orange-500 text-white font-semibold'
									: 'block py-2 px-4 rounded hover:bg-orange-500 hover:text-white transition-all'
							}
							onClick={toggleMenu}
						>
							Ürün ekle
						</NavLink>
					</li>
					<li>
						<NavLink
							to="urun-duzenle"
							className={({ isActive }) =>
								isActive
									? 'block py-2 px-4 rounded bg-orange-500 text-white font-semibold'
									: 'block py-2 px-4 rounded hover:bg-orange-500 hover:text-white transition-all'
							}
							onClick={toggleMenu}
						>
							Ürün düzenle
						</NavLink>
					</li>
					<li>
						<NavLink
							to="siparisler"
							className={({ isActive }) =>
								isActive
									? 'block py-2 px-4 rounded bg-orange-500 text-white font-semibold'
									: 'block py-2 px-4 rounded hover:bg-orange-500 hover:text-white transition-all'
							}
							onClick={toggleMenu}
						>
							Siparişler
						</NavLink>
					</li>
				</>
			);
		} else if (user.role === 'admin') {
			return (
				<>
					<li>
						<NavLink
							to="urun-onayla"
							className={({ isActive }) =>
								isActive
									? 'block py-2 px-4 rounded bg-orange-500 text-white font-semibold'
									: 'block py-2 px-4 rounded hover:bg-orange-500 hover:text-white transition-all'
							}
							onClick={toggleMenu}
						>
							Ürün Onayla
						</NavLink>
					</li>
				</>
			);
		}
	};

	return (
		<aside className="relative">
			<button
				className={`${
					!isMenuOpen ? 'block' : 'hidden'
				} lg:hidden p-4 text-2xl absolute`}
				onClick={toggleMenu}
			>
				<IoMenu />
			</button>
			<button
				className={`${
					isMenuOpen ? 'block' : 'hidden'
				} lg:hidden p-4 text-2xl absolute right-0`}
				onClick={toggleMenu}
			>
				<IoClose />
			</button>

			<div
				className={`${
					isMenuOpen ? 'block' : 'hidden'
				} w-screen h-screen lg:block sm:w-64 bg-white text-neutral-800 border-r rounded transition-all z-50`}
			>
				<nav className="flex flex-col px-4">
					<Link
						to="/satici"
						className="text-3xl font-bold text-orange-600 py-4"
					>
						hepsiburada
					</Link>
					<ul className="mt-2 flex flex-col justify-start gap-1 ">
						{renderMenuItems()}
						<hr className="m-2" />
						<li>
							<button
								to="siparisler"
								className={
									'flex items-center gap-2 w-full py-2 px-4 rounded border border-orange-500 text-left hover:bg-orange-500 hover:text-white transition-all'
								}
								onClick={handleLogout}
							>
								<MdLogout className="text-2xl" />
								Çıkış Yap
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</aside>
	);
};

export default Sidebar;
