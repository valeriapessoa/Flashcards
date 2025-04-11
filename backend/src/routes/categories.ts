import express, { Request, Response } from "express";
import prisma from '../libs/prismaClient';

const router = express.Router();

// Buscar todas as categorias
router.get("/", async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar categorias", error });
  }
});

export default router;