import { UserRepositoryPort } from "../../../core/domain/ports/user-repository";

import { PasswordHasherPort } from "../../../core/domain/ports/password-hasher";
import { GetUserByEmailUseCase } from "./get-user-by-email";
import { AuthLoginResponse, AuthLoginUserInformation } from "../../../core/domain/ports/auth-service";
import { UserNotFoundError } from "../../../core/domain/shared/error/user-not-found";
import { InvalidPasswordError } from "../../../core/domain/shared/error/invalid-password";
import { JWTPort } from "../../../core/domain/ports/jwt";
import { ILoggerPort } from "src/core/domain/ports/logger";

export class UserLoginUseCase {
    constructor(private readonly authRepository: UserRepositoryPort,
        private readonly hasher: PasswordHasherPort,
        private readonly jwt: JWTPort,
        private readonly logger: ILoggerPort
    ) {}

    async execute(user: AuthLoginUserInformation): Promise<AuthLoginResponse> {
        this.logger.info('Executing login user use case');
        const getUserByEmailUseCase = new GetUserByEmailUseCase(this.authRepository, this.logger);
        const userExists = await getUserByEmailUseCase.execute(user.email);

        if (userExists === null) throw new UserNotFoundError(user.email);
        this.logger.info('User found');
        
        const isPasswordMatch = await this.hasher.compare(user.password, userExists.password ?? '');
        
        if (!isPasswordMatch) throw new InvalidPasswordError();
        this.logger.info('Password match');

        const token = await this.jwt.generateToken({
            id: userExists._id
        });
        this.logger.info('Token generated');
        this.logger.info('Login user use case executed');
        return {
            token,
            user: userExists
        }
    }
}