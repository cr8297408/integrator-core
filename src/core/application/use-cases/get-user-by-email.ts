import { User } from "src/core/domain/entities/user";
import { UserRepositoryPort } from "src/core/domain/ports/user-repository";

export class GetUserByEmailUseCase {
    
    constructor(private readonly userRepository: UserRepositoryPort) { }

    async execute(email: string): Promise<User | null> {
        const user = await this.userRepository.findByEmail(email);
        return user;
    }
}