import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";
import uploadMiddleware from "../middleware/uploadMiddleware";
import { protect } from "../middleware/authMiddleware";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create", protect, uploadMiddleware.single("image"), async (req: Request, res: Response) => {
  try {
    const { title, description, userId, tags } = req.body;

    if (!title || !description || !userId) {
      return res.status(400).json({ message: "Título, descrição e ID do usuário são obrigatórios!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Imagem obrigatória para criar um flashcard." });
    }

    // Função que faz o upload para o Cloudinary usando Promise
    const uploadImageToCloudinary = (fileBuffer: Buffer): Promise<string> => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "flashcards" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result?.secure_url || "");
            }
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });
    };

    const imageUrl = await uploadImageToCloudinary(req.file.buffer);

    const categoryConnectOrCreate = tags?.map((tagName: string) => ({
      where: { name: tagName },
      create: { name: tagName },
    })) || [];

    const newFlashcard = await prisma.flashcard.create({
      data: {
        title,
        description,
        imageUrl,
        userId,
        categories: {
          connectOrCreate: categoryConnectOrCreate,
        },
      },
      include: { categories: true },
    });

    return res.status(201).json(newFlashcard);
  } catch (error) {
    console.error("Erro ao criar flashcard:", error);
    return res.status(500).json({ message: "Erro ao criar flashcard" });
  }
});

export default router;
