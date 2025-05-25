import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Spinner = () => {
	return (
		<div className="flex items-center justify-center h-full w-full">
			<FaSpinner className="animate-spin text-orange-500 text-3xl" />
		</div>
	);
};

export default Spinner;
