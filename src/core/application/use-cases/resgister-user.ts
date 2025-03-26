import { type ILoggerPort } from 'src/core/domain/ports/logger';
import { User } from '../../domain/entities/user';
import { type PasswordHasherPort } from '../../domain/ports/password-hasher';
import { type UserRepositoryPort } from '../../domain/ports/user-repository';
import { type RegisterDto } from '../dto/register';

export class RegisterUserUseCase {
  constructor(
    private readonly authRepository: UserRepositoryPort,
    private readonly hasher: PasswordHasherPort,
    private readonly logger: ILoggerPort
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    this.logger.info('Executing register user use case');
    const hashedPassword = await this.hasher.hash(dto.password);
    this.logger.info('Password hashed');

    const user = new User();
    user.email = dto.email;
    user.password = hashedPassword;
    user.fullName = dto.fullName;
    user.createdAt = new Date();

    this.logger.info('User Build');

    await this.authRepository.save(user);
    this.logger.info('User saved');
    this.logger.info('Register user use case executed');
    return user;
  }
}
