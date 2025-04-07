import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import * as streamifier from 'streamifier';
import { Request, Response, NextFunction } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Somente arquivos de imagem são permitidos!'));
    }
    callback(null, true);
  },
});

const newUploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error("Erro no upload:", err);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      console.warn("Nenhum arquivo enviado.");
      return res.status(400).json({ message: 'Imagem obrigatória.' });
    }

    try {
      console.log("Enviando imagem para o Cloudinary...");
      const stream = streamifier.createReadStream(req.file.buffer);

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'uploads',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
            public_id: `${Date.now()}-${req.file?.originalname}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.pipe(uploadStream);
      });

      req.file.path = (result as any).secure_url;
      console.log("Upload finalizado. URL da imagem:", req.file.path);
      next();
    } catch (error) {
      console.error('Erro ao enviar imagem para o Cloudinary:', error);
      res.status(500).json({ message: 'Erro ao fazer upload da imagem.' });
    }
  });
};

export default newUploadMiddleware;
