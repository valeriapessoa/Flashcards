import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import newUploadMiddleware from "../middleware/newUploadMiddleware";
import { protect } from "../middleware/authMiddleware";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// Tipagem da Request autenticada
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// 📌 Criar flashcard
router.post("/create", protect, newUploadMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('📥 Requisição recebida - Criar Flashcard');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const { title, description, userId, tags: tagsString } = req.body;

    if (!title || !description || !userId) {
      return res.status(400).json({ message: "Título, descrição e ID do usuário são obrigatórios!" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Imagem é obrigatória para criar um flashcard." });
    }

    let tags: string[] = [];
    try {
      if (tagsString) {
        tags = typeof tagsString === 'string'
          ? tagsString.split(',').map(tag => tag.trim())
          : [];
      }
    } catch (err) {
      console.warn("⚠️ Erro ao processar tags:", tagsString, err);
    }

    const categoryConnectOrCreate = tags.map(tag => ({
      where: { name: tag },
      create: { name: tag },
    }));

    const newFlashcard = await prisma.flashcard.create({
      data: {
        title,
        description,
        imageUrl: req.file.path,
        userId,
        categories: {
          connectOrCreate: categoryConnectOrCreate,
        },
      },
      include: { categories: true },
    });

    return res.status(201).json(newFlashcard);
  } catch (error: any) {
    console.error("❌ Erro ao criar flashcard:", error.message);
    return res.status(500).json({ message: "Erro ao criar flashcard", details: error.message });
  }
});

// ✏️ Atualizar flashcard
router.put("/:id", protect, newUploadMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const flashcardId = parseInt(id, 10);

    if (isNaN(flashcardId)) {
      return res.status(400).json({ message: "ID do flashcard inválido." });
    }

    const { title, description, tags: tagsString } = req.body;
    const loggedInUserId = req.user?.id;

    if (!loggedInUserId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const flashcardToUpdate = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
    });

    if (!flashcardToUpdate) {
      return res.status(404).json({ message: "Flashcard não encontrado." });
    }

    if (flashcardToUpdate.userId !== loggedInUserId) {
      return res.status(403).json({ message: "Você não tem permissão para editar este flashcard." });
    }

    let tags: string[] = [];
    try {
      if (tagsString) {
        tags = typeof tagsString === 'string'
          ? JSON.parse(tagsString)
          : [];
      }
    } catch (err) {
      console.warn("⚠️ Erro ao processar tags na edição:", tagsString, err);
    }

    const dataToUpdate: any = {
      ...(title && { title }),
      ...(description && { description }),
    };

    if (req.file?.path) {
      dataToUpdate.imageUrl = req.file.path;
      // Aqui você pode deletar a imagem antiga do Cloudinary, se desejar
    }

    if (tags.length > 0) {
      dataToUpdate.categories = {
        set: [],
        connectOrCreate: tags.map(tag => ({
          where: { name: tag },
          create: { name: tag },
        })),
      };
    }

    const updatedFlashcard = await prisma.flashcard.update({
      where: { id: flashcardId },
      data: dataToUpdate,
      include: { categories: true },
    });

    return res.status(200).json(updatedFlashcard);
  } catch (error: any) {
    console.error("❌ Erro ao atualizar flashcard:", error.message);
    return res.status(500).json({ message: "Erro ao atualizar flashcard", details: error.message });
  }
});

export default router;
