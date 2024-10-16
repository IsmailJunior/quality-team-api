import multer from 'multer';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import cloudinary from '../config/cloudinary.mjs';
import AppError from '../utils/appError.mjs';
import { findUserByIdService } from '../services/userService.mjs';
import App from '../models/app.mjs';

const multerFilter = (_req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Not an image! Please upload only images.', 400), false);
	}
};
const storage = multer.memoryStorage();
const upload = multer({ storage, fileFilter: multerFilter });
export const uploadPhotoMiddleware = upload.single('photo');

export const uploadToCloudinaryMiddleware = async (req, _res, next) => {
	if (!req.file) return next();
	const resizedBuffer = await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toBuffer();
	const uploadStream = cloudinary.uploader.upload_stream(
		{
			resource_type: 'image',
			folder: 'public',
			allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
		},
		(err, result) => {
			if (err) {
				return next(err);
			}
			if (!result) {
				return next(new Error('Cloudinary upload result is undefined'));
			}
			req.file.path = result.secure_url;
			req.file.filename = result.public_id;
			next();
		},
	);
	uploadStream.end(resizedBuffer);
};

export const restrictRouteMiddleware =
	(...roles) =>
	(req, _res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError('You do not have permission to perform this action.', 403),
			);
		}
		next();
	};

export const protectRoutetMiddleware = async (req, _res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token)
		return next(
			new AppError('You are not logged in! Please login to get access.', 401),
		);
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	const { user: freshUser } = await findUserByIdService(decoded.id);
	if (!freshUser)
		return next(
			new AppError(
				'The user belonging to this token dose no longer exist.',
				401,
			),
		);
	if (freshUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError('User recently changed password! Please login again.', 401),
		);
	}
	req.user = freshUser;
	next();
};

export const setBundleIdToContentMiddleware = (req, _res, next) => {
	if (!req.body.bundle) req.body.bundle = req.params.bundleId;
	next();
};

export const setUserIdToBundleMiddleware = (req, _res, next) => {
	if (!req.body.user) req.body.user = req.user._id;
	next();
};

export const getMeMiddleware = (req, _res, next) => {
	req.params.id = req.user.id;
	next();
};

export const setPhotoPathToBodyMiddleware = (req, _res, next) => {
	if (req.file) req.body.photo = req.file.path;
	if (!req.body.photo)
		return next(new AppError('Please provide a photo.', 400));
	next();
};

export const setUserIdToControllerMiddleware = (req, _res, next) => {
	req.body.user = req.params.id;
	next();
};

export const authenticateKeyMiddleware = async (req, _res, next) => {
	const apiKey = req.header('x-api-key');
	const app = await App.findOne({ apiKey });
	if (!app) return next(new AppError('You not allowed.', 403));
	next();
};
