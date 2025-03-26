import { Product, ProductStatus } from '../../domain/entities/product';
import { type ProductRepositoryPort } from '../../domain/ports/product-repository';
import { LoggerInstance } from '../../../infraestructure/shared/logger';
import { GetProductByIdUseCase } from '../use-cases/get-product-by-id';

describe('GetProductByIdUseCase', () => {
  let repository: jest.Mocked<ProductRepositoryPort>;
  let useCase: GetProductByIdUseCase;

  const MOCK_ID = 'prod-123';
  const OWNER_ID = 'user-456';

  const mockProduct = new Product();
  mockProduct._id = MOCK_ID;
  mockProduct.name = 'Test Product';
  mockProduct.ownerId = OWNER_ID;
  mockProduct.price = 99.99;
  mockProduct.status = ProductStatus.ACTIVE;
  mockProduct.createdAt = new Date();
  mockProduct.isValidated = true;

  beforeEach(() => {
    repository = {
      findById: jest.fn().mockResolvedValue(mockProduct),
    } as unknown as jest.Mocked<ProductRepositoryPort>;

    // Usar la instancia real del logger
    useCase = new GetProductByIdUseCase(repository, LoggerInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve product with correct ID and ownerID', async () => {
    const result = await useCase.execute(MOCK_ID, OWNER_ID);

    expect(repository.findById).toHaveBeenCalledWith(MOCK_ID, OWNER_ID);
    expect(result).toEqual(mockProduct);
  });

  test('should return null when product not found', async () => {
    repository.findById.mockResolvedValueOnce(null);

    const result = await useCase.execute('invalid-id', OWNER_ID);
    expect(result).toBeNull();
  });

  test('should propagate repository errors', async () => {
    const mockError = new Error('Database error');
    repository.findById.mockRejectedValueOnce(mockError);

    await expect(useCase.execute(MOCK_ID, OWNER_ID)).rejects.toThrow(mockError);
  });

  test('should handle different owner IDs correctly', async () => {
    const differentOwner = 'user-789';

    const response = await useCase.execute(MOCK_ID, differentOwner);
    expect(repository.findById).toHaveBeenCalledWith(MOCK_ID, differentOwner);
    expect(response).toBeNull();
  });

  test('should handle empty ID values', async () => {
    await useCase.execute('', OWNER_ID);
    expect(repository.findById).toHaveBeenCalledWith('', OWNER_ID);
  });
});