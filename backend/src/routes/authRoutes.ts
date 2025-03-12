import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

type UserCreateInputWithPassword = {
  name: string;
  email: string;
  password: string;
};

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      } as UserCreateInputWithPassword,
    });
    res.status(201).json({ message: "Usuário criado!", user });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

export default router;
