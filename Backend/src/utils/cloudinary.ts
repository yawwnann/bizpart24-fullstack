import { v2 as cloudinary } from 'cloudinary';
import { logger } from './logger';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary Upload Error:', error);
          reject(error);
        } else {
          resolve(result?.secure_url);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};
