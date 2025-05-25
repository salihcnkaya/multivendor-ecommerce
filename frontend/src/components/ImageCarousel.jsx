import { useState } from 'react';
const ImageCarousel = ({ images }) => {
	const [activeImage, setActiveImage] = useState(images[0]);

	const handleThumbnailClick = (image) => {
		setActiveImage(image);
	};

	return (
		<div className="flex flex-col items-center">
			{/* Ana Görsel */}
			<div className="w-full max-w-md border rounded-lg">
				<img
					src={activeImage}
					alt="Product"
					className="w-full h-auto object-contain rounded-lg"
				/>
			</div>

			{/* Thumbnail'lar */}
			<div className="flex space-x-4 mt-4">
				{images.map((image, index) => (
					<div
						key={index}
						className={`w-11 h-14 border rounded-md cursor-pointer ${
							activeImage === image ? 'border-orange-500' : 'border-gray-100'
						}`}
						onClick={() => handleThumbnailClick(image)}
					>
						<img
							src={image}
							alt={`Thumbnail ${index + 1}`}
							className="w-full h-full object-cover rounded-md"
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default ImageCarousel;
