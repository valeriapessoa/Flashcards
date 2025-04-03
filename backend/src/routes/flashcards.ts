import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


// Criar um flashcard vinculado a um usuário
router.post("/create", async (req: Request, res: Response) => {
  try {
    // Modificado para receber userId em vez de email
    const { title, description, imageUrl, userId, tags } = req.body;

    // Modificado para validar userId
    if (!title || !description || !userId) {
      return res.status(400).json({ message: "Título, descrição e ID do usuário são obrigatórios!" });
    }

    // Remover busca de usuário por email, pois já temos o userId
    // Opcional: Verificar se o userId existe no banco para maior segurança,
    // mas a chave estrangeira no Prisma já deve garantir isso na criação.
    // const userExists = await prisma.user.findUnique({ where: { id: userId } });
    // if (!userExists) {
    //   return res.status(404).json({ message: "Usuário com o ID fornecido não encontrado!" });
    // }

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
        userId: userId, // Usar o userId recebido diretamente
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
