import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import { body, validationResult } from 'express-validator';

type UserCreateInputWithPassword = {
  name: string;
  email: string;
  password: string;
};

const router = express.Router();
const prisma = new PrismaClient();

const registerValidationRules = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
];

const loginValidationRules = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
];

router.post("/register", registerValidationRules, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

router.post("/login", loginValidationRules, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Remover o password antes de enviar para o frontend por segurança
    const { password: removedPassword, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

export default router;
