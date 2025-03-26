import { LoggerInstance } from '../../../infraestructure/shared/logger';
import { type User } from '../../domain/entities/user';
import { type JWTPort } from '../../domain/ports/jwt';
import { type PasswordHasherPort } from '../../domain/ports/password-hasher';
import { type UserRepositoryPort } from '../../domain/ports/user-repository';
import { InvalidPasswordError } from '../../domain/shared/error/invalid-password';
import { UserNotFoundError } from '../../domain/shared/error/user-not-found';
import { UserLoginUseCase } from '../use-cases/login-user';

describe('UserLoginUseCase', () => {
  let authRepository: jest.Mocked<UserRepositoryPort>;
  let hasher: jest.Mocked<PasswordHasherPort>;
  let jwt: jest.Mocked<JWTPort>;
  let useCase: UserLoginUseCase;

  const MOCK_EMAIL = 'test@example.com';
  const MOCK_PASSWORD = 'valid-password';
  const mockUser: User = {
    _id: 'user-123',
    name: 'Test User',
    email: MOCK_EMAIL,
    password: 'hashed-password',
    createdAt: new Date(),
  } as unknown as User;

  beforeEach(() => {
    authRepository = {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
    } as unknown as jest.Mocked<UserRepositoryPort>;

    hasher = {
      compare: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<PasswordHasherPort>;

    jwt = {
      generateToken: jest.fn().mockResolvedValue('mock-token'),
    } as unknown as jest.Mocked<JWTPort>;

    useCase = new UserLoginUseCase(
      authRepository,
      hasher,
      jwt,
      LoggerInstance
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return token and user for valid credentials', async () => {
    const result = await useCase.execute({
      email: MOCK_EMAIL,
      password: MOCK_PASSWORD,
    });

    expect(result.token).toBe('mock-token');
    expect(result.user).toEqual(mockUser);
    expect(authRepository.findByEmail).toHaveBeenCalledWith(MOCK_EMAIL);
    expect(hasher.compare).toHaveBeenCalledWith(
      MOCK_PASSWORD,
      'hashed-password'
    );
  });

  test('should throw UserNotFoundError for unknown email', async () => {
    authRepository.findByEmail.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({ email: 'unknown@test.com', password: MOCK_PASSWORD })
    ).rejects.toThrow(UserNotFoundError);
  });

  test('should throw InvalidPasswordError for incorrect password', async () => {
    hasher.compare.mockResolvedValueOnce(false);

    await expect(
      useCase.execute({ email: MOCK_EMAIL, password: 'wrong-password' })
    ).rejects.toThrow(InvalidPasswordError);
  });

  test('should generate token with user ID', async () => {
    await useCase.execute({ email: MOCK_EMAIL, password: MOCK_PASSWORD });

    expect(jwt.generateToken).toHaveBeenCalledWith({
      id: mockUser._id,
    });
  });

  test('should propagate repository errors', async () => {
    const mockError = new Error('Database failure');
    authRepository.findByEmail.mockRejectedValueOnce(mockError);

    await expect(
      useCase.execute({ email: MOCK_EMAIL, password: MOCK_PASSWORD })
    ).rejects.toThrow(mockError);
  });

  test('should handle empty password', async () => {
    await expect(
      useCase.execute({ email: MOCK_EMAIL, password: '' })
    ).rejects.toThrow(InvalidPasswordError);
  });
});