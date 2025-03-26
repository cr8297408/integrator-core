import { Injectable } from "@nestjs/common";
import { AuthLoginResponse, AuthLoginUserInformation, AuthRegisterUserInformation, AuthServicePort } from "../../core/domain/ports/auth-service";
import { RegisterUserUseCase } from "../../core/application/use-cases/resgister-user";
import { User } from "../../core/domain/entities/user";
import { GetUserByEmailUseCase } from "../../core/application/use-cases/get-user-by-email";
import { UserAlreadyExistError } from "../../core/domain/shared/error/user-already-exist";
import { UserRepositoryAdapter } from "../mongodb/adapters/user-repository";
import { PasswordHasherAdapter } from "./password-hasher";
import { UserLoginUseCase } from "src/core/application/use-cases/login-user";
import { JWTAdapter } from "./jwt";

@Injectable()
export class AuthService implements AuthServicePort {
    
    constructor(private repository: UserRepositoryAdapter, private hasher: PasswordHasherAdapter, private jwt: JWTAdapter) {}

    async login(user: AuthLoginUserInformation): Promise<AuthLoginResponse> {
        const userLogin = new UserLoginUseCase(this.repository, this.hasher, this.jwt);
        const userLogged = await userLogin.execute({
            email: user.email,
            password: user.password
        });
        return userLogged;
    }

    async register(user: AuthRegisterUserInformation): Promise<User> {
        const getUserByEmailUseCase = new GetUserByEmailUseCase(this.repository);
        const userExists = await getUserByEmailUseCase.execute(user.email);
        if (userExists !== null) {
            throw new UserAlreadyExistError(user.email);
        }
        const createUserUseCase = new RegisterUserUseCase(this.repository, this.hasher);
        const userCreated = await createUserUseCase.execute({
            email: user.email,
            password: user.password,
            fullName: user.fullName
        });

        userCreated.password = undefined;

        return userCreated;
    }

}