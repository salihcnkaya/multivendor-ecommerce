import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [cart, setCart] = useState(null);
	const { isCheckingAuth, isAuthenticated } = useAuth();

	const fetchCart = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get('http://localhost:5000/api/cart', {
				withCredentials: true,
			});
			setCart(response.data.cart);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!isCheckingAuth && isAuthenticated) {
			fetchCart();
		}
	}, [isCheckingAuth, isAuthenticated]);

	const addToCart = async (product, quantity = 1) => {
		setIsLoading(true);
		try {
			const response = await axios.post(
				'http://localhost:5000/api/cart/add',
				{
					defaultVendor: {
						...product.defaultVendor,
						price: Number(product.defaultVendor.price),
					},
					quantity,
				},
				{ withCredentials: true }
			);
			setCart(response.data.cart);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const updateCartItem = async (product, quantity) => {
		setIsLoading(true);
		try {
			const response = await axios.post(
				'http://localhost:5000/api/cart/update',
				{
					defaultVendor: {
						...product.productVendor,
						price: Number(product.productVendor.price),
					},
					quantity,
				},
				{ withCredentials: true }
			);

			await fetchCart();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};
	const removeCartItem = async (product) => {
		setIsLoading(true);
		try {
			const response = await axios.post(
				'http://localhost:5000/api/cart/remove',
				{
					defaultVendor: {
						...product.productVendor,
						// product: product.productVendor.product._id,
						// vendor: product.productVendor.vendor._id,
					},
				},
				{ withCredentials: true }
			);
			setCart(response.data.cart);
			setIsLoading(false);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const clearCart = async () => {
		setIsLoading(true);
		try {
			const response = await axios.put(
				'http://localhost:5000/api/cart/clear',
				{},
				{
					withCredentials: true,
				}
			);
			setCart(response.data.cart);
			setIsLoading(false);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				setCart,
				addToCart,
				isLoading,
				updateCartItem,
				removeCartItem,
				clearCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
