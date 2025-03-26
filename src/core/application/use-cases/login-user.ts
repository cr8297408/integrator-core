import { UserRepositoryPort } from "../../../core/domain/ports/user-repository";

import { PasswordHasherPort } from "../../../core/domain/ports/password-hasher";
import { GetUserByEmailUseCase } from "./get-user-by-email";
import { AuthLoginResponse, AuthLoginUserInformation } from "../../../core/domain/ports/auth-service";
import { UserNotFoundError } from "../../../core/domain/shared/error/user-not-found";
import { InvalidPasswordError } from "../../../core/domain/shared/error/invalid-password";
import { JWTPort } from "../../../core/domain/ports/jwt";

export class UserLoginUseCase {
    constructor(private readonly authRepository: UserRepositoryPort,
        private readonly hasher: PasswordHasherPort,
        private readonly jwt: JWTPort) {}

    async execute(user: AuthLoginUserInformation): Promise<AuthLoginResponse> {
        const getUserByEmailUseCase = new GetUserByEmailUseCase(this.authRepository);
        const userExists = await getUserByEmailUseCase.execute(user.email);

        if (userExists === null) throw new UserNotFoundError(user.email);
        
        const isPasswordMatch = await this.hasher.compare(user.password, userExists.password ?? '');
        
        if (!isPasswordMatch) throw new InvalidPasswordError();

        const token = await this.jwt.generateToken(userExists.id);

        return {
            token,
            user: userExists
        }
    }
}