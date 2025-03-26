import { type User } from '../../../core/domain/entities/user';
import { UserAlreadyExistError } from '../../../core/domain/shared/error/user-already-exist';
import { type UserRepositoryAdapter } from '../../mongodb/adapters/user-repository';
import { AuthServiceAdapter } from '../auth-service';
import { type JWTAdapter } from '../jwt';
import { type PasswordHasherAdapter } from '../password-hasher';

describe('AuthServiceAdapter', () => {
  let userRepository: jest.Mocked<UserRepositoryAdapter>;
  let passwordHasher: jest.Mocked<PasswordHasherAdapter>;
  let jwtService: jest.Mocked<JWTAdapter>;
  let authService: AuthServiceAdapter;

  const mockUser: User = {
    _id: 'user-123',
    email: 'test@example.com',
    password: 'hashed-password',
    fullName: 'Test User',
    createdAt: new Date(),
  } as unknown as User;

  const mockLoginDto = {
    email: 'test@example.com',
    password: 'valid-password'
  };

  const mockRegisterDto = {
    email: 'test@example.com',
    password: 'password',
    fullName: 'Test User'
  };

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue(mockUser),
    } as unknown as jest.Mocked<UserRepositoryAdapter>;

    passwordHasher = {
      compare: jest.fn().mockResolvedValue(true),
      hash: jest.fn().mockResolvedValue('hashed-password'),
    } as unknown as jest.Mocked<PasswordHasherAdapter>;

    jwtService = {
      generateToken: jest.fn().mockResolvedValue('mock-token'),
    } as unknown as jest.Mocked<JWTAdapter>;

    authService = new AuthServiceAdapter(
      userRepository,
      passwordHasher,
      jwtService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    test('should return auth response with valid credentials', async () => {
      userRepository.findByEmail.mockResolvedValueOnce(mockUser);
      const result = await authService.login(mockLoginDto);

      expect(result.token).toBe('mock-token');
      expect(result.user.email).toBe(mockLoginDto.email);
      expect(result.user.password).toBeUndefined();
    });

    test('should propagate authentication errors', async () => {
      userRepository.findByEmail.mockRejectedValueOnce(new Error('DB Error'));

      await expect(authService.login(mockLoginDto)).rejects.toThrow('DB Error');
    });
  });

  describe('register', () => {
    test('should create new user with valid data', async () => {
      const result = await authService.register(mockRegisterDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockRegisterDto.email);
      expect(passwordHasher.hash).toHaveBeenCalledWith(mockRegisterDto.password);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result.password).toBeUndefined();
    });

    test('should throw UserAlreadyExistError for existing email', async () => {
      userRepository.findByEmail.mockResolvedValueOnce(mockUser);

      await expect(authService.register(mockRegisterDto))
        .rejects.toThrow(UserAlreadyExistError);
    });

    test('should sanitize password in response', async () => {
      const result = await authService.register(mockRegisterDto);

      expect(result).toMatchObject({
        email: mockRegisterDto.email,
        fullName: mockRegisterDto.fullName
      });
      expect(result.password).toBeUndefined();
    });

    test('should handle registration failures', async () => {
      userRepository.save.mockRejectedValueOnce(new Error('Save failed'));

      await expect(authService.register(mockRegisterDto))
        .rejects.toThrow('Save failed');
    });
  });

  test('should use same repository instance across operations', async () => {
    await authService.register(mockRegisterDto);
    userRepository.findByEmail.mockResolvedValueOnce(mockUser);
    await authService.login(mockLoginDto);

    expect(userRepository.findByEmail).toHaveBeenCalledTimes(2);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
  });
});