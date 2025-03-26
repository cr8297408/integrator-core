import { type ProductRepositoryPort } from 'src/core/domain/ports/product-repository';
import { LoggerInstance } from '../../../infraestructure/shared/logger';
import { CountProductsUseCase } from '../use-cases/count-products';

describe('CountProductsUseCase Tests', () => {
  let productRepository: jest.Mocked<ProductRepositoryPort>;
  const logger = LoggerInstance
  let useCase: CountProductsUseCase;

  const mockUserId = 'user-123';
  const mockCount = 5;

  beforeEach(() => {
    productRepository = {
      count: jest.fn().mockResolvedValue(mockCount),
    } as unknown as jest.Mocked<ProductRepositoryPort>;

    useCase = new CountProductsUseCase(productRepository, logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the correct count from repository', async () => {
    // Execute
    const result = await useCase.execute(mockUserId);

    // Verify
    expect(result).toEqual(mockCount);
    expect(productRepository.count).toHaveBeenCalledWith(mockUserId);
  });

  test('should handle zero count correctly', async () => {
    // Configure mock to return 0
    productRepository.count.mockResolvedValueOnce(0);

    // Execute
    const result = await useCase.execute(mockUserId);

    // Verify
    expect(result).toEqual(0);
  });

  test('should propagate repository errors', async () => {
    // Configure mock to reject
    const mockError = new Error('Database error');
    productRepository.count.mockRejectedValueOnce(mockError);

    // Verify
    await expect(useCase.execute(mockUserId)).rejects.toThrow(mockError);
  });
});
