import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
	const [products, setProducts] = useState([]);
	const [unapprovedProducts, setUnapprovedProducts] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [vendorProducts, setVendorProducts] = useState([]);
	const [productDetails, setProductDetails] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const response = await axios.get('http://localhost:5000/api/products');
			setProducts(response.data.products);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProductDetails = async (slug, storeSlug) => {
		setLoading(true);
		try {
			let url = `http://localhost:5000/api/products/${slug}`;
			if (storeSlug) {
				url += `?magaza=${storeSlug}`;
			}
			const response = await axios.get(url);

			setProductDetails(response.data);
		} catch (err) {
			if (err.response && err.response.status === 404) {
				setError('Ürün bulunamadı');
			} else {
				setError('Bir hata oluştu');
			}
		} finally {
			setLoading(false);
		}
	};

	// Ürün arama fonksiyonu
	const searchProducts = async (query) => {
		setLoading(true);
		try {
			const response = await axios.get(
				'http://localhost:5000/api/products/search',
				{
					params: { search: query },
				}
			);
			setSearchResults(response.data.products);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const clearSearchResults = () => {
		setSearchResults([]);
	};

	const addProduct = async (product) => {
		setLoading(true);
		try {
			const response = await axios.post(
				'http://localhost:5000/api/products',
				product,
				{ withCredentials: true }
			);
			fetchVendorProducts();
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	};
	const editProduct = async (product) => {
		setLoading(true);
		try {
			const response = await axios.put(
				`http://localhost:5000/api/products/${product.slug}`,
				product,
				{ withCredentials: true }
			);
			fetchVendorProducts();
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	};
	const deleteProduct = async (product) => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`http://localhost:5000/api/products/${product.slug}`,
				{ withCredentials: true }
			);
			fetchVendorProducts();
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	const fetchVendorProducts = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				'http://localhost:5000/api/vendor/products',
				{ withCredentials: true }
			);
			setVendorProducts(response.data);
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	const fetchUnapprovedProducts = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				'http://localhost:5000/api/admin/products/unapproved',
				{ withCredentials: true }
			);
			setUnapprovedProducts(response.data.products);
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	const approveProduct = async (slug) => {
		setLoading(true);
		try {
			const response = await axios.put(
				`http://localhost:5000/api/admin/approve-product/${slug}`,
				{},
				{ withCredentials: true }
			);
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ProductContext.Provider
			value={{
				addProduct,
				editProduct,
				approveProduct,
				deleteProduct,
				setSearchResults,
				clearSearchResults,
				searchResults,
				products,
				productDetails,
				vendorProducts,
				unapprovedProducts,
				fetchProducts,
				fetchProductDetails,
				fetchVendorProducts,
				fetchUnapprovedProducts,
				searchProducts,
				loading,
				error,
			}}
		>
			{children}
		</ProductContext.Provider>
	);
};
