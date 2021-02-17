import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../configs/auth';
import { msg_error_auth_email_password } from '../configs/messages';

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

    if (!user) {
      throw new Error(msg_error_auth_email_password);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error(msg_error_auth_email_password);
    }
    // sign({payload}, secret_key, {configuracoes_do_token})
    // Colocar essa secret_key depois em um arquivo de configuração
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      // se somente se(em raros casos) necessário manter o usuário logado para sempre, pesquisar métodos de refresh token
      expiresIn: expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
