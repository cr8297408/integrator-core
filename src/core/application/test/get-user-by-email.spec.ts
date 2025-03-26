import { User } from '../../domain/entities/user';
import { type UserRepositoryPort } from '../../domain/ports/user-repository';
import { LoggerInstance } from '../../../infraestructure/shared/logger';
import { GetUserByEmailUseCase } from '../use-cases/get-user-by-email';

describe('GetUserByEmailUseCase', () => {
  let repository: jest.Mocked<UserRepositoryPort>;
  let useCase: GetUserByEmailUseCase;

  const MOCK_EMAIL = 'test@example.com';
  const UNKNOWN_EMAIL = 'unknown@example.com';

  const mockUser = new User();
  mockUser._id = 'user-123';
  mockUser.fullName = 'Test User';
  mockUser.email = MOCK_EMAIL;
  mockUser.password = 'hashed_password';
  mockUser.createdAt = new Date();

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn().mockImplementation(async (email: string) =>
        email === MOCK_EMAIL ? await Promise.resolve(mockUser) : await Promise.resolve(null)
      ),
    } as unknown as jest.Mocked<UserRepositoryPort>;

    useCase = new GetUserByEmailUseCase(repository, LoggerInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve user with correct email', async () => {
    const result = await useCase.execute(MOCK_EMAIL);

    expect(repository.findByEmail).toHaveBeenCalledWith(MOCK_EMAIL);
    expect(result).toEqual(mockUser);
  });

  test('should return null for unknown email', async () => {
    const result = await useCase.execute(UNKNOWN_EMAIL);

    expect(repository.findByEmail).toHaveBeenCalledWith(UNKNOWN_EMAIL);
    expect(result).toBeNull();
  });

  test('should propagate repository errors', async () => {
    const mockError = new Error('Database connection error');
    repository.findByEmail.mockRejectedValueOnce(mockError);

    await expect(useCase.execute(MOCK_EMAIL)).rejects.toThrow(mockError);
  });

  test('should handle empty email', async () => {
    const result = await useCase.execute('');

    expect(repository.findByEmail).toHaveBeenCalledWith('');
    expect(result).toBeNull();
  });

  test('should handle email case insensitivity', async () => {
    const mixedCaseEmail = 'Test@Example.com';

    await useCase.execute(mixedCaseEmail);
    expect(repository.findByEmail).toHaveBeenCalledWith(mixedCaseEmail);
  });
});