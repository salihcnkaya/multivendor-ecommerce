import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/webp'
	) {
		cb(null, true);
	} else {
		cb(new Error('Image format is not valid!'), false);
	}
};

export const upload = multer({ storage, fileFilter });
