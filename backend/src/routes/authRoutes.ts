import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import passport from 'passport';
import jwt from 'jsonwebtoken';
import prisma from '../libs/prismaClient';
import { body, validationResult } from 'express-validator';
import { googleCallback } from '../controllers/authController';

// TODO: Mover para variáveis de ambiente (.env)
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SECRET_KEY';
type UserCreateInputWithPassword = {
  name: string;
  email: string;
  password: string;
};

const router = express.Router();

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
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ message: "Email já está em uso." });
    }
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// Modifica a rota de login para usar Passport
router.post("/login", loginValidationRules, (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  passport.authenticate('local', { session: false }, (err: Error | null, user: any | false, info: { message: string } | undefined) => {
    if (err) {
      console.error("Erro na autenticação:", err);
      return res.status(500).json({ message: "Erro interno no servidor durante a autenticação." });
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || "Credenciais inválidas." });
    }

    req.login(user, { session: false }, (loginErr) => {
      if (loginErr) {
        console.error("Erro no req.login:", loginErr);
        return res.status(500).json({ message: "Erro ao processar login." });
      }

      const payload = {
        id: user.id,
        email: user.email,
        name: user.name
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      const { password: removedPassword, ...userWithoutPassword } = user;

      return res.json({ token, user: userWithoutPassword });
    });
  })(req, res, next);
});

// Rota de callback para o Google OAuth
router.post('/oauth/callback/google', googleCallback);

// Rota OAuth antiga (mantida para compatibilidade)
router.post("/oauth", async (req: Request, res: Response) => {
  const { code, provider } = req.body;

  if (!code || !provider) {
    return res.status(400).json({ message: "Código e provedor são obrigatórios." });
  }

  try {
    let tokenResponse;

    if (provider === 'google') {
      tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      });
    } else if (provider === 'facebook') {
      tokenResponse = await axios.post('https://graph.facebook.com/v10.0/oauth/access_token', {
        code,
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
      });
    } else {
      return res.status(400).json({ message: "Provedor inválido." });
    }

    const accessToken = tokenResponse.data.access_token;

    const payload = {
      provider,
      accessToken,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (error) {
    console.error("Erro na autenticação OAuth:", error);
    return res.status(500).json({ message: "Erro ao autenticar via OAuth." });
  }
});

export default router;
