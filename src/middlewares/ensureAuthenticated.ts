import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../configs/auth';
import { msg_without_token, msg_invalid_token } from '../configs/messages';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(request: Request, respnse: Response, next: NextFunction): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error(msg_without_token);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    request.user = { id: sub }; // Adicionando o id do usuário dentro do request para que esteja disponível em todas as rotas

    return next();
  } catch (err) {
    throw new Error(msg_invalid_token);
  }
}
