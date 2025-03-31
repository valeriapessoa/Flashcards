import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Estende a interface Request do Express para incluir a propriedade 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Verifica se o header Authorization existe e começa com 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extrai o token (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verifica o token usando o segredo do NextAuth
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string) as JwtPayload;

      // Anexa o ID do usuário à requisição para uso posterior nas rotas
      // Baseado na configuração do NextAuth (authOptions.ts), o ID está em 'id' no token JWT
      if (decoded && typeof decoded === 'object' && decoded.id) {
         req.user = { id: decoded.id as string };
         next(); // Token válido, prossegue para a próxima função/middleware
      } else {
          console.error("Token JWT decodificado inválido ou sem ID:", decoded);
          res.status(401).json({ message: 'Não autorizado, token inválido (payload)' });
      }

    } catch (error) {
      console.error('Erro na verificação do token:', error);
      res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, nenhum token fornecido' });
  }
};