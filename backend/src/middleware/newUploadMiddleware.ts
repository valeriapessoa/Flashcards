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

    // Se um arquivo foi enviado, processa e faz upload para o Cloudinary
    if (req.file) {
      try {
        console.log("Arquivo recebido. Enviando imagem para o Cloudinary...");
        const stream = streamifier.createReadStream(req.file.buffer);

        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'uploads', // Considere tornar isso configurável ou mais específico
              allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
              // Usar public_id único para evitar sobrescritas acidentais, se necessário
              public_id: `${Date.now()}-${req.file?.originalname.split('.')[0]}`, // Exemplo: remove extensão do nome original
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
        req.file.path = (result as any).secure_url;
        console.log("Upload para Cloudinary finalizado. URL da imagem:", req.file.path);
        next(); // Prossegue para a rota APÓS o upload bem-sucedido

      } catch (error) {
        console.error('Erro ao enviar imagem para o Cloudinary:', error);
        // Retorna um erro 500 se o upload falhar
        return res.status(500).json({ message: 'Erro ao fazer upload da imagem.' });
      }
    } else {
      // Se NENHUM arquivo foi enviado, apenas prossegue para a rota
      console.log("Nenhum arquivo de imagem enviado, prosseguindo para a rota.");
      next();
    }
  });
};

export default newUploadMiddleware;
