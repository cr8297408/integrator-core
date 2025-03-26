import { CreateProductUseCase, GetProductsUseCase, CountProductsUseCase, GetProductByIdUseCase, UpdateProductUseCase, DeleteProductUseCase, ValidateProductUseCase } from '../../../core/application/use-cases';
import { type Product } from '../../../core/domain/entities/product';
import { ProductNotFoundError } from '../../../core/domain/shared/error/product-not-found';
import { SystemError } from '../../../core/domain/shared/error/system';
import { type ProductRepositoryAdapter } from '../../mongodb/adapters/product-repository';
import { LoggerInstance } from '../../shared/logger';
import { type FinancialCoreProxyAdapter } from '../financial-core';
import { ProductServiceAdapter } from '../product-service';

jest.mock('../../../core/application/use-cases/create-product');
jest.mock('../../../core/application/use-cases/get-products');
jest.mock('../../../core/application/use-cases/count-products');
jest.mock('../../../core/application/use-cases/get-product-by-id');
jest.mock('../../../core/application/use-cases/update-product');
jest.mock('../../../core/application/use-cases/delete-product');
jest.mock('../../../core/application/use-cases/validate-product');

describe('ProductServiceAdapter', () => {
  let repository: jest.Mocked<ProductRepositoryAdapter>;
  let financialCore: jest.Mocked<FinancialCoreProxyAdapter>;
  let service: ProductServiceAdapter;

  const mockOwnerId = 'user-123';
  const mockProductId = 'prod-456';
  const mockProduct: Product = {
    _id: mockProductId,
    name: 'Test Product',
    price: 99.99,
    ownerId: mockOwnerId,
    createdAt: new Date(),
    isValidated: true,
    status: 'ACTIVE'
  } as unknown as Product;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ProductRepositoryAdapter>;

    financialCore = {
      sendEventValidateProduct: jest.fn(),
    } as unknown as jest.Mocked<FinancialCoreProxyAdapter>;

    service = new ProductServiceAdapter(repository, financialCore);

    // Reset all mocked use cases
    jest.mocked(CreateProductUseCase).mockClear();
    jest.mocked(ValidateProductUseCase).mockClear();
    jest.mocked(GetProductsUseCase).mockClear();
    jest.mocked(CountProductsUseCase).mockClear();
    jest.mocked(GetProductByIdUseCase).mockClear();
    jest.mocked(UpdateProductUseCase).mockClear();
    jest.mocked(DeleteProductUseCase).mockClear();
  });

  describe('create', () => {
    const mockCreateDto = { name: 'New Product', price: 100 };

    test('should create product with validation', async () => {
      jest.mocked(ValidateProductUseCase.prototype.execute).mockResolvedValue(true);
      jest.mocked(CreateProductUseCase.prototype.execute).mockResolvedValue(mockProduct);

      const result = await service.create(mockCreateDto, mockOwnerId);

      expect(ValidateProductUseCase).toHaveBeenCalledWith(financialCore, LoggerInstance);
      expect(CreateProductUseCase).toHaveBeenCalledWith(repository, LoggerInstance);
      expect(result).toEqual(mockProduct);
    });

    test('should propagate validation errors', async () => {
      const mockError = new Error('Validation failed');
      jest.mocked(ValidateProductUseCase.prototype.execute).mockRejectedValue(mockError);

      await expect(service.create(mockCreateDto, mockOwnerId)).rejects.toThrow(mockError);
    });
  });

  describe('findAll', () => {
    const mockPagination = { page: 1, limit: 10, skip: 0 };

    test('should return paginated results', async () => {
      const mockProducts = [mockProduct];
      const totalItems = 1;

      jest.mocked(GetProductsUseCase.prototype.execute).mockResolvedValue(mockProducts);
      jest.mocked(CountProductsUseCase.prototype.execute).mockResolvedValue(totalItems);

      const result = await service.findAll(mockPagination, mockOwnerId);

      expect(result).toEqual({
        data: mockProducts,
        currentPage: mockPagination.page,
        totalItems,
        totalPages: 1
      });
    });

    test('should handle empty results', async () => {
      jest.mocked(GetProductsUseCase.prototype.execute).mockResolvedValue([]);
      jest.mocked(CountProductsUseCase.prototype.execute).mockResolvedValue(0);

      const result = await service.findAll(mockPagination, mockOwnerId);

      expect(result.totalPages).toBe(0);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('findById', () => {
    test('should return product when exists', async () => {
      jest.mocked(GetProductByIdUseCase.prototype.execute).mockResolvedValue(mockProduct);

      const result = await service.findById(mockProductId, mockOwnerId);
      expect(result).toEqual(mockProduct);
    });

    test('should throw ProductNotFoundError when not exists', async () => {
      jest.mocked(GetProductByIdUseCase.prototype.execute).mockResolvedValue(null);

      await expect(service.findById(mockProductId, mockOwnerId))
        .rejects.toThrow(ProductNotFoundError);
    });
  });

  describe('update', () => {
    const mockUpdate = { name: 'Updated Product' };

    test('should update existing product', async () => {
      jest.mocked(GetProductByIdUseCase.prototype.execute).mockResolvedValue(mockProduct);
      jest.mocked(UpdateProductUseCase.prototype.execute).mockResolvedValue();

      const result = await service.update({ ...mockUpdate, _id: mockProductId }, mockOwnerId);

      expect(UpdateProductUseCase.prototype.execute).toHaveBeenCalledWith({ ...mockUpdate, _id: mockProductId });
      expect(result).toMatchObject({ ...mockUpdate, _id: mockProductId });
    });

    test('should throw SystemError when missing id', async () => {
      await expect(service.update(mockUpdate, mockOwnerId))
        .rejects.toThrow(SystemError);
    });
  });

  describe('delete', () => {
    test('should delete existing product', async () => {
      jest.mocked(GetProductByIdUseCase.prototype.execute).mockResolvedValue(mockProduct);
      jest.mocked(DeleteProductUseCase.prototype.execute).mockResolvedValue();

      await service.delete(mockProductId, mockOwnerId);

      expect(DeleteProductUseCase.prototype.execute).toHaveBeenCalledWith(mockProductId);
    });

    test('should throw error when product not found', async () => {
      jest.mocked(GetProductByIdUseCase.prototype.execute).mockResolvedValue(null);

      await expect(service.delete(mockProductId, mockOwnerId))
        .rejects.toThrow(ProductNotFoundError);
    });
  });

  describe('edge cases', () => {
    test('should handle pagination with zero limit', async () => {
      const mockPagination = { page: 0, limit: 0, skip: 0 };
      jest.mocked(GetProductsUseCase.prototype.execute).mockResolvedValue([]);
      jest.mocked(CountProductsUseCase.prototype.execute).mockResolvedValue(10);

      const result = await service.findAll(mockPagination, mockOwnerId);
      expect(result.totalPages).toBe(Infinity);
    });
  });
});