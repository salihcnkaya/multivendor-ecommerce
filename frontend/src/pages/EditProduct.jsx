import React, { useEffect, useState } from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { ProductModal, ConfirmationModal } from '../components/ProductModal';
import { useProductContext } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const ProductCard = ({ product, onEditClick, onDeleteClick }) => {
	return (
		<li className="border rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 mb-4">
			<div className="w-full flex items-center gap-4">
				<img
					src="https://productimages.hepsiburada.net/s/777/424-600/110000887118711.jpg/format:webp"
					alt=""
					className="size-20 object-contain"
				/>
				<div className="flex flex-col">
					<p className="font-semibold text-neutral-800 text-lg tracking-tight">
						{product.product.name}
					</p>
					<div className="flex gap-4">
						<p>Stok: {product.stock}</p>
						<p>Fiyat: {product.price}TL</p>
					</div>
				</div>
			</div>
			<div className="flex sm:flex-col md:flex-row max-sm:w-full justify-end sm:items-end items-center gap-2">
				<button
					className="flex items-center gap-0.5 bg-orange-500 p-2 text-sm text-white font-semibold rounded"
					onClick={() => onEditClick(product)}
				>
					<MdModeEdit className="text-2xl" />
					Düzenle
				</button>
				<button
					className="flex items-center gap-0.5 bg-orange-500 p-2 text-sm text-white font-semibold rounded"
					onClick={() => onDeleteClick(product)}
				>
					<MdDelete className="text-2xl" />
					Sil
				</button>
			</div>
		</li>
	);
};

const EditProduct = () => {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(undefined);

	const { fetchVendorProducts, vendorProducts, editProduct, deleteProduct } =
		useProductContext();

	useEffect(() => {
		fetchVendorProducts();
	}, []);

	const handleEditModal = (product) => {
		setSelectedProduct(product);
		setIsEditModalOpen(true);
	};
	const handleDeleteModal = (product) => {
		setSelectedProduct(product);
		setIsDeleteModalOpen(true);
	};

	const handleEditSubmit = (formData) => {
		editProduct(formData);
	};
	const handleDeleteSubmit = () => {
		const slug = selectedProduct.slug || selectedProduct.product?.slug;
		deleteProduct({ slug });
	};

	return (
		<div className="m-4 flex flex-col sm:items-center sm:justify-center gap-4">
			<div className="flex flex-col gap-4 p-5 w-full">
				<ul>
					{vendorProducts.map((product) => (
						<ProductCard
							key={product._id}
							product={product}
							onEditClick={handleEditModal}
							onDeleteClick={handleDeleteModal}
						/>
					))}
				</ul>
			</div>
			{isEditModalOpen && (
				<ProductModal
					isOpen={isEditModalOpen}
					onClose={() => {
						setIsEditModalOpen(false);
						setSelectedProduct(undefined);
					}}
					selectedProduct={selectedProduct}
					onSubmit={handleEditSubmit}
				/>
			)}
			{isDeleteModalOpen && (
				<ConfirmationModal
					isOpen={isDeleteModalOpen}
					onClose={() => {
						setIsDeleteModalOpen(false);
						setSelectedProduct(undefined);
					}}
					selectedProduct={selectedProduct}
					onSubmit={handleDeleteSubmit}
				/>
			)}
		</div>
	);
};

export default EditProduct;
