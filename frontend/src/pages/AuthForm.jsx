import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const AuthForm = ({ formType, role }) => {
	const { login, isLoading } = useAuth();
	const [isLogin, setIsLogin] = useState(formType === 'login');
	const [formData, setFormData] = useState({
		name: '',
		surname: '',
		password: '',
		email: '',
		storeName: '',
		role: role,
	});

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await login(formData, role);
		} catch (error) {
			console.log(error);
		}
	};

	const isAdmin = role === 'admin';
	const isVendor = role === 'vendor';

	return (
		<>
			<div className="flex flex-col items-center pt-10 pb-14">
				<Link
					to="/"
					className={`text-3xl font-bold text-orange-600 ${
						role === 'vendor' || role === 'admin'
							? 'flex flex-col items-end'
							: ''
					}`}
				>
					hepsiburada
					{(isAdmin || isVendor) && (
						<span className="text-black text-lg font-semibold">
							{isVendor ? 'satıcı paneli' : isAdmin ? 'admin paneli' : ''}
						</span>
					)}
				</Link>
			</div>

			<div className="w-full flex flex-col mx-auto">
				<div className="flex flex-col p-2 md:p-[72px] max-w-[472px] md:border rounded-lg w-full mx-auto">
					<div className="inline-flex w-full border-b ">
						<div className="relative flex flex-row items-center justify-center w-full py-[10px] cursor-pointer">
							<div
								onClick={() => setIsLogin(true)}
								className="flex justify-center items-center w-full"
							>
								Giris yap
							</div>
							{isLogin && (
								<div className="absolute bottom-0 h-1 w-full bg-orange-500 rounded-t"></div>
							)}
						</div>
						<div className="relative flex flex-row items-center justify-center w-full py-[10px] cursor-pointer">
							<div
								onClick={() => setIsLogin(false)}
								className="flex justify-center items-center w-full"
							>
								Üye ol
							</div>
							{!isLogin && (
								<div className="absolute bottom-0 h-1 w-full bg-orange-500 rounded-t"></div>
							)}
						</div>
					</div>

					<form className="mt-6" onSubmit={handleSubmit}>
						{!isLogin && !isAdmin && (
							<>
								<input
									type="text"
									name="name"
									placeholder="İsim"
									value={formData.name}
									onChange={handleFormChange}
									className="bg-zinc-100 w-full border-2 border-zinc-100 placeholder:text-gray-600 text-gray-600 rounded-lg p-[14px] leading-6 text-base -tracking-wide focus:outline-orange-500 focus:bg-white transition-colors"
								/>
								<input
									type="text"
									name="surname"
									placeholder="Soy isim"
									value={formData.surname}
									onChange={handleFormChange}
									className="bg-zinc-100 w-full border-2 border-zinc-100 placeholder:text-gray-600 text-gray-600 rounded-lg p-[14px] leading-6 text-base -tracking-wide focus:outline-orange-500 focus:bg-white transition-colors mt-4 mb-4"
								/>
							</>
						)}
						<input
							type="email"
							name="email"
							placeholder="E-posta adresi"
							value={formData.email}
							onChange={handleFormChange}
							className="bg-zinc-100 w-full border-2 border-zinc-100 placeholder:text-gray-600 text-gray-600 rounded-lg p-[14px] leading-6 text-base -tracking-wide focus:outline-orange-500 focus:bg-white transition-colors"
						/>
						<input
							type="password"
							name="password"
							placeholder="Şifre"
							value={formData.password}
							onChange={handleFormChange}
							className={`bg-zinc-100 w-full border-2 border-zinc-100 placeholder:text-gray-600 text-gray-600 rounded-lg p-[14px] leading-6 text-base -tracking-wide focus:outline-orange-500 focus:bg-white transition-colors mt-4 ${
								!isLogin && !isVendor ? 'mb-6' : ''
							}`}
						/>
						{isVendor && !isLogin && (
							<input
								type="text"
								name="storeName"
								placeholder="Mağaza Adı"
								value={formData.storeName}
								onChange={handleFormChange}
								className="bg-zinc-100 w-full border-2 border-zinc-100 placeholder:text-gray-600 text-gray-600 rounded-lg p-[14px] leading-6 text-base -tracking-wide focus:outline-orange-500 focus:bg-white transition-colors mt-4 mb-6"
							/>
						)}
						{isLogin && (
							<div className="my-4">
								<span className="text-orange-500 text-sm leading-6 font-bold">
									Şifremi unuttum
								</span>
							</div>
						)}
						{isAdmin && !isLogin && (
							<div className="my-4">
								<span className="text-orange-500 text-sm leading-6 font-bold">
									Admin kaydı mümkün değildir.
								</span>
							</div>
						)}
						<button
							className="min-w-full flex items-center justify-center rounded-lg font-semibold p-2 bg-orange-500 hover:bg-orange-600 text-white text-base h-14 transition-all"
							disabled={isAdmin && !isLogin}
						>
							{isLogin
								? 'Giriş yap'
								: isAdmin
								? 'Admin Kaydı Yapılamaz'
								: 'Kayıt ol'}
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default AuthForm;
