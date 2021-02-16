import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

/**
 * Regras de negócios iniciais
 *  - Não pode guardar senhas não criptografadas;
 *  - Não pode salvar usuário com email já existe;
 */

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({ name, email, password });

    // Dá problema com o lint do typescript, buscar melhor forma
    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default usersRouter;
