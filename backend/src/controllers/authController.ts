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

// Interface para o perfil do usuário
interface UserProfile {
  email: string;
  name?: string | null;
  image?: string | null;
}

// Função auxiliar para criar ou atualizar usuário
async function findOrCreateUser(provider: string, profile: UserProfile): Promise<any> {
  const { email, name, image } = profile;
  
  if (!email) {
    throw new Error('Email é obrigatório para criar/atualizar usuário');
  }
  
  try {
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
          image: image || null,
          // Gera uma senha aleatória, já que o usuário está se autenticando via OAuth
          password: require('crypto').randomBytes(16).toString('hex')
        },
      });
    }

    return user;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro no findOrCreateUser:', errorMessage);
    
    // Se houver erro de conexão, tenta novamente uma vez
    if (error instanceof Error && 
        ((error as any).code === '42P05' || 
         error.message?.includes('prepared statement'))) {
      console.log('Tentando reconectar ao banco de dados...');
      // Força uma nova conexão
      await prisma.$disconnect();
      // Tenta novamente
      return findOrCreateUser(provider, profile);
    }
    
    throw new Error(`Falha ao buscar/criar usuário: ${errorMessage}`);
  }
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
    console.log('Recebendo requisição de callback do Google:', req.body);
    
    const { token, name, email, image } = req.body;

    if (!token) {
      console.error('Token não fornecido');
      return res.status(400).json({ message: 'Token é obrigatório' });
    }

    if (!email) {
      console.error('Email não fornecido');
      return res.status(400).json({ message: 'Email é obrigatório' });
    }

    try {
      // Verifica o token do Google
      console.log('Verificando token do Google...');
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      
      if (!payload) {
        console.error('Token inválido: payload vazio');
        return res.status(401).json({ message: 'Token inválido' });
      }

      // Cria ou atualiza o usuário
      console.log('Criando/atualizando usuário no banco de dados...');
      const user = await findOrCreateUser('google', {
        email,
        name: name || payload.name || 'Usuário',
        image: image || payload.picture
      });

      console.log('Usuário processado:', { id: user.id, email: user.email });

      // Gera o token JWT
      const jwtToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Remove a senha do objeto do usuário
      const { password, ...userWithoutPassword } = user;

      console.log('Autenticação bem-sucedida para o usuário:', user.email);
      
      return res.json({
        token: jwtToken,
        user: userWithoutPassword
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro na verificação do token do Google:', error);
      return res.status(401).json({ 
        message: 'Falha na autenticação com Google',
        error: errorMessage
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro inesperado no callback do Google:', error);
    return res.status(500).json({ 
      message: 'Erro interno no servidor',
      error: errorMessage
    });
  }
};
