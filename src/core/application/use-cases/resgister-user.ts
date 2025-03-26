import { UserRepositoryPort } from "../../domain/ports/user-repository";
import { PasswordHasherPort } from "../../domain/ports/password-hasher";
import { User } from "../../domain/entities/user";
import { RegisterDto } from "../dto/register";

export class RegisterUserUseCase {
    constructor(
        private readonly authRepository: UserRepositoryPort,
        private readonly hasher: PasswordHasherPort,
    ) { }

    async execute(dto: RegisterDto): Promise<User> {
        const hashedPassword = await this.hasher.hash(dto.password);

        const user = new User();
        user.email = dto.email;
        user.password = hashedPassword;
        user.fullName = dto.fullName;
        user.createdAt = new Date();

        await this.authRepository.save(user);
        return user;
    }
}