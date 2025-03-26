import { Injectable } from '@nestjs/common';
import { JWTAdapter } from './jwt';
import { PasswordHasherAdapter } from './password-hasher';
import { GetUserByEmailUseCase } from '../../core/application/use-cases/get-user-by-email';
import { UserLoginUseCase } from '../../core/application/use-cases/login-user';
import { RegisterUserUseCase } from '../../core/application/use-cases/resgister-user';
import { type User } from '../../core/domain/entities/user';
import {
  type AuthLoginResponse,
  type AuthLoginUserInformation,
  type AuthRegisterUserInformation,
  type AuthServicePort,
} from '../../core/domain/ports/auth-service';
import { type ILoggerPort } from '../../core/domain/ports/logger';
import { UserAlreadyExistError } from '../../core/domain/shared/error/user-already-exist';
import { UserRepositoryAdapter } from '../mongodb/adapters/user-repository';
import { LoggerInstance } from '../shared/logger';

@Injectable()
export class AuthServiceAdapter implements AuthServicePort {
  constructor(
    private readonly repository: UserRepositoryAdapter,
    private readonly hasher: PasswordHasherAdapter,
    private readonly jwt: JWTAdapter
  ) { }

  readonly #logger: ILoggerPort = LoggerInstance;

  async login(user: AuthLoginUserInformation): Promise<AuthLoginResponse> {
    const userLogin = new UserLoginUseCase(this.repository, this.hasher, this.jwt, this.#logger);
    const userLogged = await userLogin.execute({
      email: user.email,
      password: user.password,
    });
    return userLogged;
  }

  async register(user: AuthRegisterUserInformation): Promise<User> {
    const getUserByEmailUseCase = new GetUserByEmailUseCase(this.repository, this.#logger);
    const userExists = await getUserByEmailUseCase.execute(user.email);
    if (userExists !== null) {
      throw new UserAlreadyExistError(user.email);
    }
    const createUserUseCase = new RegisterUserUseCase(this.repository, this.hasher, this.#logger);
    const userCreated = await createUserUseCase.execute({
      email: user.email,
      password: user.password,
      fullName: user.fullName,
    });

    userCreated.password = undefined;

    return userCreated;
  }
}
