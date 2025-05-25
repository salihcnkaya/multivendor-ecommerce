import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<div
			className={`flex flex-col max-lg:gap-10 sm:flex-row h-screen ${
				isMenuOpen ? 'overflow-y-hidden max-lg:gap-0' : ''
			}`}
		>
			<Sidebar
				isMenuOpen={isMenuOpen}
				toggleMenu={() => setIsMenuOpen((prev) => !prev)}
			/>
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
};

export default DashboardLayout;
