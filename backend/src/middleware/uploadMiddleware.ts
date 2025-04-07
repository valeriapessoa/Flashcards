import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from '@fluidjs/multer-cloudinary';
import { Request } from 'express';
import multer from 'multer';

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary configurado com sucesso');
} catch (error) {
  console.error('Erro ao configurar Cloudinary:', error);
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req: Request, file: Express.Multer.File) => {
    console.log('Configuring CloudinaryStorage params for file:', file.originalname);
    try {
      const params = {
        folder: 'uploads',
        format: 'jpg',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
        public_id: `${Date.now()}-${file.originalname}`,
      };
      console.log('CloudinaryStorage params:', params);
      return params;
    } catch (error) {
      console.error('Error configuring CloudinaryStorage params:', error);
      throw error;
    }
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de tamanho de arquivo (10MB)
  fileFilter(req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
    console.log('File filter called');
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      console.log('File type not allowed');
      return callback(null, false);
    }
    console.log('File type allowed');
    callback(null, true);
  },
});

export default upload;
