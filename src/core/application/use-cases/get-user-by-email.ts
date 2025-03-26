import { User } from "src/core/domain/entities/user";
import { ILoggerPort } from "src/core/domain/ports/logger";
import { UserRepositoryPort } from "src/core/domain/ports/user-repository";

export class GetUserByEmailUseCase {
    
    constructor(private readonly userRepository: UserRepositoryPort, private readonly logger: ILoggerPort) { }

    async execute(email: string): Promise<User | null> {
        this.logger.info('Executing get user by email use case');
        const user = await this.userRepository.findByEmail(email);
        this.logger.info('Get user by email use case executed');
        return user;
    }
}