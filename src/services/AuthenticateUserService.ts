import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    const msgError = 'A combinação de email e senha não existe.';
    if (!user) {
      throw new Error(msgError);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error(msgError);
    }
    // sign({payload}, secret_key, {configuracoes_do_token})
    // Colocar essa secret_key depois em um arquivo de configuração
    const token = sign({}, 'd85425fcada3db121a6a9e64c0ab01bc', {
      subject: user.id,
      // se somente se(em raros casos) necessário manter o usuário logado para sempre, pesquisar métodos de refresh token
      expiresIn: '1d',
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
