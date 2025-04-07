import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Estende a interface Request para incluir 'user'
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

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      if (decoded && typeof decoded === 'object' && decoded.id) {
        req.user = { id: decoded.id };
        return next();
      } else {
        console.error("Token JWT decodificado inválido ou sem ID:", decoded);
        return res.status(401).json({ message: 'Token inválido: payload malformado.' });
      }

    } catch (error) {
      console.error('Erro ao verificar token JWT:', error);
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado: token ausente.' });
  }
};
