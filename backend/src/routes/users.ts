import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const router = express.Router();
const prisma = new PrismaClient();

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
    const saltRounds = 10; // Fator de custo para o hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário com senha hasheada
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword }, // Salvar a senha hasheada
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ message: "Erro ao criar usuário", error });
  }
});

export default router; // Adiciona a exportação padrão