import { type ProductRepositoryPort } from 'src/core/domain/ports/product-repository';
import { LoggerInstance } from '../../../infraestructure/shared/logger';
import { DeleteProductUseCase } from '../use-cases/delete-product';

describe('DeleteProductUseCase', () => {
  let repository: jest.Mocked<ProductRepositoryPort>;
  const logger = LoggerInstance;
  let useCase: DeleteProductUseCase;

  // Test data
  const VALID_ID = 'prod-123';

  beforeEach(() => {
    // Mock setup
    repository = {
      delete: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<ProductRepositoryPort>;

    useCase = new DeleteProductUseCase(repository, logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should delete product successfully', async () => {
    // Execute
    await useCase.execute(VALID_ID);

    // Verify
    expect(repository.delete).toHaveBeenCalledWith(VALID_ID);
  });

  test('should handle repository errors', async () => {
    const mockError = new Error('Database error');
    repository.delete.mockRejectedValueOnce(mockError);

    // Verify error
    await expect(useCase.execute(VALID_ID)).rejects.toThrow(mockError);
  });
});