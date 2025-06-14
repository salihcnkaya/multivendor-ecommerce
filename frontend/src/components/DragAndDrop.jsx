import React, { useState, useRef, useEffect } from 'react';

const MAX_FILE_SIZE_MB = 5;

const DragAndDrop = ({ isOpen, onFilesChange }) => {
	const [files, setFiles] = useState([]);
	const [error, setError] = useState('');
	const inputRef = useRef();

	useEffect(() => {
		if (!isOpen && files.length > 0) {
			files.forEach((img) => URL.revokeObjectURL(img.preview));
			setFiles([]);
		}
	}, [isOpen]);

	const handleDrop = (e) => {
		e.preventDefault();
		const droppedFiles = Array.from(e.dataTransfer.files);
		processFiles(droppedFiles);
	};

	const handleChange = (e) => {
		const selectedFiles = Array.from(e.target.files);
		processFiles(selectedFiles);
	};

	const processFiles = (selectedFiles) => {
		const newFiles = [];

		for (let file of selectedFiles) {
			if (!file.type.startsWith('image/')) {
				setError('Sadece resim dosyaları yüklenebilir.');
				continue;
			}
			if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
				setError(`"${file.name}" dosyası 5MB'den büyük.`);
				continue;
			}

			const isExisting = files.some(
				(existing) => existing.file.name === file.name
			);

			if (isExisting) {
				continue;
			}

			newFiles.push({
				file,
				preview: URL.createObjectURL(file),
			});
		}

		const updated = [...files, ...newFiles];

		setFiles(updated);
		onFilesChange(updated.map((f) => f.file));

		setError('');
	};

	const handleRemove = (index) => {
		setFiles((prev) => {
			const updated = [...prev];
			URL.revokeObjectURL(updated[index].preview);
			updated.splice(index, 1);
			return updated;
		});
	};

	return (
		<div className="max-w-md mx-auto my-4">
			<div
				className="border-2 border-dashed border-orange-500 rounded-md p-6 text-center cursor-pointer transition hover:bg-gray-50"
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}
				onClick={() => inputRef.current.click()}
			>
				<p className="text-gray-500">Görselleri buraya sürükle ya da tıkla</p>
				<input
					type="file"
					multiple
					accept="image/*"
					onChange={handleChange}
					ref={inputRef}
					className="hidden"
				/>
			</div>

			{files.length > 0 && (
				<div className="mt-4 flex flex-wrap gap-3">
					{files.map((img, index) => (
						<div key={img.preview} className="relative size-16">
							<img
								src={img.preview}
								alt={`preview-${index}`}
								className="object-cover w-full h-full rounded border"
							/>
							<button
								onClick={() => handleRemove(index)}
								className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
							>
								×
							</button>
						</div>
					))}
				</div>
			)}

			{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
		</div>
	);
};

export default DragAndDrop;
