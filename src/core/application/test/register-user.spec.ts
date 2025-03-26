import { LoggerInstance } from '../../../infraestructure/shared/logger';
import { User } from '../../domain/entities/user';
import { type AuthRegisterUserInformation } from '../../domain/ports/auth-service';
import { type PasswordHasherPort } from '../../domain/ports/password-hasher';
import { type UserRepositoryPort } from '../../domain/ports/user-repository';
import { RegisterUserUseCase } from '../use-cases/resgister-user';

describe('RegisterUserUseCase', () => {
  let userRepository: jest.Mocked<UserRepositoryPort>;
  let hasher: jest.Mocked<PasswordHasherPort>;
  let useCase: RegisterUserUseCase;

  const mockDate = new Date('2024-01-01');
  const mockDto: AuthRegisterUserInformation = {
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User'
  };

  const mockHashedPassword = 'hashed-password-123';
  const mockUser = new User();

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(mockDate);

    userRepository = {
      save: jest.fn().mockImplementation(async (user) => await Promise.resolve(user)),
    } as unknown as jest.Mocked<UserRepositoryPort>;

    hasher = {
      hash: jest.fn().mockResolvedValue(mockHashedPassword),
    } as unknown as jest.Mocked<PasswordHasherPort>;

    useCase = new RegisterUserUseCase(
      userRepository,
      hasher,
      LoggerInstance
    );

    mockUser.email = mockDto.email;
    mockUser.password = mockHashedPassword;
    mockUser.fullName = mockDto.fullName;
    mockUser.createdAt = mockDate;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('should register user with hashed password', async () => {
    const result = await useCase.execute(mockDto);

    expect(hasher.hash).toHaveBeenCalledWith(mockDto.password);
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    expect(result).toMatchObject({
      email: mockDto.email,
      fullName: mockDto.fullName,
      password: mockHashedPassword,
      createdAt: mockDate
    });
  });

  test('should set creation date correctly', async () => {
    const newDate = new Date('2024-02-01');
    jest.setSystemTime(newDate);

    const result = await useCase.execute(mockDto);
    expect(result.createdAt).toEqual(newDate);
  });

  test('should propagate hashing errors', async () => {
    const mockError = new Error('Hashing failed');
    hasher.hash.mockRejectedValueOnce(mockError);

    await expect(useCase.execute(mockDto)).rejects.toThrow(mockError);
  });

  test('should handle repository save errors', async () => {
    const mockError = new Error('Database error');
    userRepository.save.mockRejectedValueOnce(mockError);

    await expect(useCase.execute(mockDto)).rejects.toThrow(mockError);
  });

  test('should handle empty password', async () => {
    const emptyPassDto = { ...mockDto, password: '' };
    hasher.hash.mockResolvedValueOnce('');

    const result = await useCase.execute(emptyPassDto);
    expect(result.password).toBe('');
  });

  test('should return user instance with correct properties', async () => {
    const result = await useCase.execute(mockDto);

    expect(result).toBeInstanceOf(User);
    expect(result).toMatchObject({
      email: mockDto.email,
      fullName: mockDto.fullName,
      password: mockHashedPassword
    });
  });
});