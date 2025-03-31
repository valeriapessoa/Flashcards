import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router(); // Use diretamente express.Router, sem `Router` importado separadamente
const prisma = new PrismaClient();

// Criar um flashcard vinculado a um usuário
router.post("/flashcards", async (req: express.Request, res: express.Response) => {
  try {
    const { title, description, imageUrl, userId, tags } = req.body;

    if (!title || !description || !userId) {
      return res.status(400).json({ message: "Título, descrição e userId são obrigatórios!" });
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Criar ou conectar categorias baseadas nas tags
    const categoryConnectOrCreate = await Promise.all(
      (tags || []).map(async (tagName: string) => {
        return {
          where: { name: tagName },
          create: { name: tagName },
        };
      })
    );

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
    return res.status(500).json({ message: "Erro ao criar flashcard", error });
  }
});

// Buscar todos os flashcards
router.get("/", async (req: Request, res: Response) => {
  try {
    const flashcards = await prisma.flashcard.findMany({
      include: { user: true, categories: true },
    });
    return res.status(200).json(flashcards);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar flashcards", error });
  }
});

export default router;
