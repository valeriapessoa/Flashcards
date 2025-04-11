import express, { Request, Response } from "express";
import prisma from '../libs/prismaClient';
import bcrypt from "bcrypt";

const router = express.Router();

// Criar um novo usuário antes de permitir a criação de um flashcard
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nome, email e senha são obrigatórios!" });
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já cadastrado!" });
    }

    // Hashear a senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário com senha hasheada
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ message: "Erro ao criar usuário", error });
  }
});

export default router;