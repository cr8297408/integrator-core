import { ProductStatus, Product } from '../../domain/entities/product';
import { type ProductRepositoryPort } from '../../domain/ports/product-repository';
import { type PaginationInput } from '../../domain/ports/product-service';
import { LoggerInstance } from '../../../infraestructure/shared/logger';
import { GetProductsUseCase } from '../use-cases/get-products';

describe('GetProductsUseCase', () => {
  let repository: jest.Mocked<ProductRepositoryPort>;
  let useCase: GetProductsUseCase;

  const mockUserId = 'user-123';
  const mockPagination: PaginationInput = { skip: 0, limit: 10 };
  const mockProduct1 = new Product();
  mockProduct1._id = 'prod-1';
  mockProduct1.name = 'Product 1';
  mockProduct1.ownerId = mockUserId;
  mockProduct1.price = 100;
  mockProduct1.status = ProductStatus.ACTIVE;
  mockProduct1.createdAt = new Date();
  mockProduct1.isValidated = true;

  const mockProduct2 = new Product();
  mockProduct2._id = 'prod-2';
  mockProduct2.name = 'Product 2';
  mockProduct2.ownerId = mockUserId;
  mockProduct2.price = 200;
  mockProduct2.status = ProductStatus.ACTIVE;
  mockProduct2.createdAt = new Date();
  mockProduct2.isValidated = false;


  const mockProducts: Product[] = [mockProduct1, mockProduct2];

  beforeEach(() => {
    repository = {
      find: jest.fn().mockResolvedValue(mockProducts),
    } as unknown as jest.Mocked<ProductRepositoryPort>;

    useCase = new GetProductsUseCase(repository, LoggerInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve products with correct parameters', async () => {
    const result = await useCase.execute(mockUserId, mockPagination);

    expect(repository.find).toHaveBeenCalledWith(mockUserId, mockPagination);
    expect(result).toEqual(mockProducts);
    expect(result.length).toBe(2);
  });

  test('should handle different pagination parameters', async () => {
    const customPagination: PaginationInput = { skip: 20, limit: 20 };

    await useCase.execute(mockUserId, customPagination);
    expect(repository.find).toHaveBeenCalledWith(mockUserId, customPagination);
  });

  test('should return empty array when no products found', async () => {
    repository.find.mockResolvedValueOnce([]);

    const result = await useCase.execute(mockUserId, mockPagination);
    expect(result).toEqual([]);
  });

  test('should propagate repository errors', async () => {
    const mockError = new Error('Database connection failed');
    repository.find.mockRejectedValueOnce(mockError);

    await expect(useCase.execute(mockUserId, mockPagination))
      .rejects
      .toThrow(mockError);
  });
});