import * as bcrypt from 'bcrypt';
import { PasswordHasherAdapter } from '../password-hasher';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordHasherAdapter', () => {
  let adapter: PasswordHasherAdapter;
  const mockSaltRounds = 10;
  const mockHashedPassword = '$2b$10$hashedpassword';
  const mockPlainPassword = 'password123';

  beforeEach(() => {
    adapter = new PasswordHasherAdapter();
    jest.clearAllMocks();
  });

  describe('hash', () => {
    test('should hash password with bcrypt and correct salt rounds', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(mockHashedPassword);

      const result = await adapter.hash(mockPlainPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        mockPlainPassword,
        mockSaltRounds
      );
      expect(result).toBe(mockHashedPassword);
    });

    test('should reject when bcrypt hashing fails', async () => {
      const mockError = new Error('Hashing failed');
      (bcrypt.hash as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(adapter.hash(mockPlainPassword))
        .rejects.toThrow(mockError);
    });

    test('should handle empty password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed-empty');

      const result = await adapter.hash('');

      expect(bcrypt.hash).toHaveBeenCalledWith('', mockSaltRounds);
      expect(result).toBe('hashed-empty');
    });
  });

  describe('compare', () => {
    const mockHash = '$2b$10$storedhash';

    test('should return true for matching password and hash', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await adapter.compare(mockPlainPassword, mockHash);
      expect(result).toBe(true);
    });

    test('should return false for non-matching password and hash', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await adapter.compare('wrong-password', mockHash);
      expect(result).toBe(false);
    });

    test('should reject when bcrypt comparison fails', async () => {
      const mockError = new Error('Comparison error');
      (bcrypt.compare as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(adapter.compare(mockPlainPassword, mockHash))
        .rejects.toThrow(mockError);
    });

    test('should handle empty parameters', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await adapter.compare('', '');
      expect(result).toBe(false);
    });
  });
});