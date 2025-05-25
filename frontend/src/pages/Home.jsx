import React, { useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useProductContext } from '../context/ProductContext';
import Spinner from '../components/Spinner';

const Home = () => {
	const { products, loading } = useProductContext();

	if (loading) {
		return (
			<div className="h-screen w-screen flex justify-center items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 my-4 max-sm:pb-16">
			<div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
				{products.map((product) => (
					<ProductCard key={product.name} product={product} />
				))}
			</div>
		</div>
	);
};

export default Home;
