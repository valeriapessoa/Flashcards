import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import * as streamifier from 'streamifier';
import { Request, Response, NextFunction } from 'express';
import { Express } from 'express-serve-static-core';
import path from 'path';

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
  console.log('[DEBUG][UPLOAD] Iniciando middleware de upload');
  console.log('[DEBUG][UPLOAD] Headers:', req.headers);
  console.log('[DEBUG][UPLOAD] Content-Type:', req.headers['content-type']);
  
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      console.error("Erro no upload:", err);
      return res.status(400).json({ message: err.message });
    }
    
    if (req.files) {
      console.log('[DEBUG][UPLOAD] Arquivos recebidos:', req.files);
    } else {
      console.log('[DEBUG][UPLOAD] Nenhum arquivo recebido');
    }

    // Se um arquivo foi enviado, processa e faz upload para o Cloudinary
    if (req.files) {
      try {
        const files = req.files as { 
          image?: Express.Multer.File[];
          backImage?: Express.Multer.File[];
        };

        const image = files?.image?.[0];
        const backImage = files?.backImage?.[0];

        if (image) {
          console.log("Arquivo recebido. Enviando imagem para o Cloudinary...");
          const stream = streamifier.createReadStream(image.buffer);

          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'uploads', // Considere tornar isso configurável ou mais específico
                allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
                // Usar public_id único para evitar sobrescritas acidentais, se necessário
                public_id: `${Date.now()}-${image.originalname.split('.')[0]}`, // Exemplo: remove extensão do nome original
              },
              (error, result) => {
                if (error) {
                  console.error("Erro no stream de upload do Cloudinary:", error);
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
            stream.pipe(uploadStream);
          });

          // Adiciona a URL segura ao objeto req.file para uso na rota
          req.body.image = (result as any).secure_url;
          console.log("Upload para Cloudinary finalizado. URL da imagem:", req.body.image);
        }

        if (backImage) {
          console.log("Arquivo recebido. Enviando imagem para o Cloudinary...");
          const stream = streamifier.createReadStream(backImage.buffer);

          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'uploads', // Considere tornar isso configurável ou mais específico
                allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
                // Usar public_id único para evitar sobrescritas acidentais, se necessário
                public_id: `${Date.now()}-${backImage.originalname.split('.')[0]}`, // Exemplo: remove extensão do nome original
              },
              (error, result) => {
                if (error) {
                  console.error("Erro no stream de upload do Cloudinary:", error);
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
            stream.pipe(uploadStream);
          });

          // Adiciona a URL segura ao objeto req.file para uso na rota
          req.body.backImage = (result as any).secure_url;
          console.log("Upload para Cloudinary finalizado. URL da imagem:", req.body.backImage);
        }

        next(); 

      } catch (error) {
        console.error('Erro ao enviar imagem para o Cloudinary:', error);
        return res.status(500).json({ message: 'Erro ao fazer upload da imagem.' });
      }
    } else {
      console.log("Nenhum arquivo de imagem enviado, prosseguindo para a rota.");
      next();
    }
  });
};

export default newUploadMiddleware;