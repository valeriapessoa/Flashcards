import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import prisma from '../libs/prismaClient';

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SECRET_KEY';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// Função auxiliar para criar ou atualizar usuário
async function findOrCreateUser(provider: string, profile: any) {
  const { email, name, image } = profile;
  
  // Verifica se o usuário já existe
  let user = await prisma.user.findUnique({
    where: { email },
  });

  // Se o usuário não existir, cria um novo
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || 'Usuário',
        image,
        // Gera uma senha aleatória, já que o usuário está se autenticando via OAuth
        password: require('crypto').randomBytes(16).toString('hex')
      },
    });
  }

  return user;
}

export const facebookCallback = async (req: Request, res: Response) => {
  try {
    const { token, name, email, image } = req.body;

    if (!token || !email) {
      return res.status(400).json({ message: 'Token e email são obrigatórios' });
    }

    // Verifica o token do Facebook
    const response = await axios.get(`https://graph.facebook.com/v12.0/me?fields=id,name,email,picture&access_token=${token}`);
    const profile = response.data;
    
    if (!profile) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Verifica se o email do token corresponde ao email fornecido
    if (profile.email !== email) {
      return res.status(401).json({ message: 'Email não corresponde ao token' });
    }

    // Cria ou atualiza o usuário
    const user = await findOrCreateUser('facebook', {
      email,
      name: name || profile.name,
      image: image || profile.picture?.data?.url
    });

    // Gera o token JWT
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Remove a senha do objeto do usuário
    const { password, ...userWithoutPassword } = user;

    return res.json({
      token: jwtToken,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro no callback do Facebook:', error);
    return res.status(500).json({ message: 'Erro ao autenticar com Facebook' });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { token, name, email, image } = req.body;

    if (!token || !email) {
      return res.status(400).json({ message: 'Token e email são obrigatórios' });
    }

    // Verifica o token do Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Verifica se o email do token corresponde ao email fornecido
    if (payload.email !== email) {
      return res.status(401).json({ message: 'Email não corresponde ao token' });
    }

    // Cria ou atualiza o usuário
    const user = await findOrCreateUser('google', {
      email,
      name: name || payload.name,
      image: image || payload.picture
    });


    // Gera o token JWT
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Remove a senha do objeto do usuário
    const { password, ...userWithoutPassword } = user;

    return res.json({
      token: jwtToken,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro no callback do Google:', error);
    return res.status(500).json({ message: 'Erro ao autenticar com Google' });
  }
};
