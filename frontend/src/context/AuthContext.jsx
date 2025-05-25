import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userAddresses, setUserAdresses] = useState(undefined);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [role, setRole] = useState(null);
	const navigate = useNavigate();

	const checkAuth = async () => {
		setIsCheckingAuth(true);
		try {
			const response = await axios.get(
				'http://localhost:5000/api/auth/check-auth',
				{
					withCredentials: true,
				}
			);

			if (response.data && response.data.user) {
				setUser(response.data.user);
				setIsAuthenticated(true);
			}
		} catch (error) {
			setIsAuthenticated(false);
		} finally {
			setIsCheckingAuth(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	useEffect(() => {
		if (!isCheckingAuth && isAuthenticated) {
			getAdresses();
		}
	}, [isCheckingAuth, isAuthenticated]);

	const login = async (formData, role) => {
		setIsLoading(true);
		try {
			const response = await axios.post(
				`http://localhost:5000/api/auth/${role}/login`,
				formData,
				{
					withCredentials: true,
				}
			);
			setRole(role);
			setUser(response.data.user);
			setIsAuthenticated(true);
			setIsLoading(false);
			if (role === 'vendor') {
				navigate('/satici');
			} else if (role === 'admin') {
				navigate('/admin');
			} else {
				navigate('/profil');
			}
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	const getAdresses = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get('http://localhost:5000/api/address', {
				withCredentials: true,
			});
			setUserAdresses(response.data.addresses);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const editAddress = async (address) => {
		setIsLoading(true);
		try {
			const response = await axios.put(
				'http://localhost:5000/api/address/update',
				address,
				{ withCredentials: true }
			);
			getAdresses();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};
	const addAddress = async (address) => {
		setIsLoading(true);
		try {
			const response = await axios.post(
				'http://localhost:5000/api/address/add',
				address,
				{ withCredentials: true }
			);
			getAdresses();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};
	const deleteAddress = async (addressId) => {
		setIsLoading(true);
		try {
			const response = await axios.delete(
				`http://localhost:5000/api/address/delete/${addressId}`,
				{ withCredentials: true }
			);
			getAdresses();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async (role) => {
		setIsLoading(true);
		try {
			await axios.post(
				`http://localhost:5000/api/auth/${role}/logout`,
				{},
				{
					withCredentials: true,
				}
			);
			setUser(null);
			setIsAuthenticated(false);
			setIsLoading(false);
			if (role === 'vendor') {
				navigate('/auth/satici/giris-yap');
			} else if (role === 'admin') {
				navigate('/auth/admin/giris-yap');
			} else {
				navigate('/auth/giris-yap');
			}
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	const update = async (formData) => {
		setIsLoading(true);
		try {
			await axios.put(
				'http://localhost:5000/api/user/profile/update',
				formData,
				{ withCredentials: true }
			);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated,
				isCheckingAuth,
				userAddresses,
				addAddress,
				editAddress,
				deleteAddress,
				login,
				logout,
				checkAuth,
				update,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
