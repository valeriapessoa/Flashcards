import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


// Criar um flashcard vinculado a um usuário
router.post("/flashcards/create", async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl, email, tags } = req.body;

    if (!title || !description || !email) {
      return res.status(400).json({ message: "Título, descrição e email do usuário são obrigatórios!" });
    }

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado! Primeiro, crie um usuário." });
    }

    // Criar ou conectar categorias baseadas nas tags
    const categoryConnectOrCreate = tags?.map((tagName: string) => ({
      where: { name: tagName },
      create: { name: tagName },
    })) || [];

    const newFlashcard = await prisma.flashcard.create({
      data: {
        title,
        description,
        imageUrl,
        userId: user.id,
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
router.get("/flashcards", async (req: Request, res: Response) => {
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
