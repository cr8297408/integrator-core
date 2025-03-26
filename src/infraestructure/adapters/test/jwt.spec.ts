import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { JWTAdapter } from '../jwt';

describe('JWTAdapter', () => {
  let jwtService: jest.Mocked<JwtService>;
  let adapter: JWTAdapter;

  const mockToken = 'mock.jwt.token';
  const mockPayload = { userId: '123', role: 'admin' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue(mockToken),
          },
        },
        JWTAdapter,
      ],
    }).compile();

    jwtService = module.get(JwtService);
    adapter = module.get(JWTAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    test('should call JwtService with correct payload', async () => {
      await adapter.generateToken(mockPayload);

      expect(jwtService.signAsync).toHaveBeenCalledWith(mockPayload);
    });

    test('should return generated token', async () => {
      const result = await adapter.generateToken(mockPayload);

      expect(result).toBe(mockToken);
    });

    test('should handle different payload types', async () => {
      const complexPayload = {
        sub: 'user-123',
        metadata: { roles: ['admin', 'user'] },
        iat: Date.now()
      };

      await adapter.generateToken(complexPayload);
      expect(jwtService.signAsync).toHaveBeenCalledWith(complexPayload);
    });

    test('should propagate JwtService errors', async () => {
      const error = new Error('Token generation failed');
      jwtService.signAsync.mockRejectedValueOnce(error);

      await expect(adapter.generateToken(mockPayload))
        .rejects.toThrow(error);
    });

    test('should handle empty payload', async () => {
      await adapter.generateToken({});

      expect(jwtService.signAsync).toHaveBeenCalledWith({});
    });
  });
});