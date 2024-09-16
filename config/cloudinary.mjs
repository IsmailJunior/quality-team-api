// eslint-disable-next-line import/no-extraneous-dependencies
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CloudinaryStorage } from 'multer-storage-cloudinary';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'users',
		allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
	},
});

export { cloudinary };
