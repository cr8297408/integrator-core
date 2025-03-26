import { Product, ProductStatus } from '../../domain/entities/product';
import { type ProductRepositoryPort } from '../../domain/ports/product-repository';
import { LoggerInstance } from '../../../infraestructure/shared/logger';
import { CreateProductUseCase } from '../use-cases/create-product';

describe('CreateProductUseCase Tests', () => {
  let repository: jest.Mocked<ProductRepositoryPort>;
  const logger = LoggerInstance;
  let useCase: CreateProductUseCase;

  const mockDate = new Date('2024-01-01T00:00:00.000Z');
  const mockProductInput = {
    name: 'Test Product',
    price: 99.99,
    ownerId: 'user-123'
  };

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(mockDate);

    repository = {
      save: jest.fn().mockImplementation(async (p) => await Promise.resolve(p)),
    } as unknown as jest.Mocked<ProductRepositoryPort>;

    useCase = new CreateProductUseCase(repository, logger);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('should create and save product with correct properties', async () => {
    // Execute
    const result = await useCase.execute(mockProductInput, true);

    // Verify
    expect(result).toBeInstanceOf(Product);
    expect(result).toEqual(expect.objectContaining({
      name: mockProductInput.name,
      price: mockProductInput.price,
      ownerId: mockProductInput.ownerId,
      status: ProductStatus.ACTIVE,
      createdAt: mockDate,
      isValidated: true
    }));
    expect(repository.save).toHaveBeenCalledWith(result);
  });

  test('should handle validation flag correctly', async () => {
    // Test with validated false
    const unvalidatedResult = await useCase.execute(mockProductInput, false);
    expect(unvalidatedResult.isValidated).toBe(false);

    // Test with validated true
    const validatedResult = await useCase.execute(mockProductInput, true);
    expect(validatedResult.isValidated).toBe(true);
  });

  test('should set creation timestamp correctly', async () => {
    const newDate = new Date('2024-02-01T00:00:00.000Z');
    jest.setSystemTime(newDate);

    const result = await useCase.execute(mockProductInput, true);
    expect(result.createdAt).toEqual(newDate);
  });

  test('should propagate repository errors', async () => {
    const mockError = new Error('Database connection failed');
    repository.save.mockRejectedValueOnce(mockError);

    await expect(useCase.execute(mockProductInput, true))
      .rejects
      .toThrow(mockError);
  });

  test('should return the created product instance', async () => {
    const result = await useCase.execute(mockProductInput, true);
    expect(repository.save).toHaveBeenCalledWith(result);
    expect(result).toBeInstanceOf(Product);
  });
});