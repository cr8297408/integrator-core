import { Injectable } from '@nestjs/common';
import { CountProductsUseCase } from 'src/core/application/use-cases/count-products';
import { CreateProductUseCase } from 'src/core/application/use-cases/create-product';
import { DeleteProductUseCase } from 'src/core/application/use-cases/delete-product';
import { GetProductByIdUseCase } from 'src/core/application/use-cases/get-product-by-id';
import { GetProductsUseCase } from 'src/core/application/use-cases/get-products';
import { UpdateProductUseCase } from 'src/core/application/use-cases/update-product';
import { ValidateProductUseCase } from 'src/core/application/use-cases/validate-product';
import { type Product } from 'src/core/domain/entities/product';
import { type PaginationInput, type ProductServicePort } from 'src/core/domain/ports/product-service';
import { ProductNotFoundError } from 'src/core/domain/shared/error/product-not-found';
import { SystemError } from 'src/core/domain/shared/error/system';
import { type IResponseDataHttpList } from 'src/infraestructure/http/model/response-list';
import { FinancialCoreProxyAdapter } from './financial-core';
import { type CreateProductDto } from '../http/dto/request/CreateProductDto';
import { ProductRepositoryAdapter } from '../mongodb/adapters/product-repository';
import { LoggerInstance } from '../shared/logger';

@Injectable()
export class ProductServiceAdapter implements ProductServicePort {
  readonly #logger = LoggerInstance;
  constructor(
    private readonly repository: ProductRepositoryAdapter,
    private readonly financialCore: FinancialCoreProxyAdapter
  ) {}

  async create(productInput: CreateProductDto, ownerId: string): Promise<Product> {
    const validateProductUseCase = new ValidateProductUseCase(this.financialCore, this.#logger);

    const validateProduct = await validateProductUseCase.execute(productInput.price);

    const createProductUseCase = new CreateProductUseCase(this.repository, this.#logger);
    return await createProductUseCase.execute(
      {
        ...productInput,
        ownerId,
      },
      validateProduct
    );
  }

  async findAll(pagination: PaginationInput, owner: string): Promise<Omit<IResponseDataHttpList<Product>, 'status'>> {
    const findProductsUseCase = new GetProductsUseCase(this.repository, this.#logger);
    const products = await findProductsUseCase.execute(owner, pagination);

    const countAllItemsUseCase = new CountProductsUseCase(this.repository, this.#logger);
    const totalItems = await countAllItemsUseCase.execute(owner);

    return {
      data: products,
      currentPage: Math.floor(pagination.skip / pagination.limit),
      totalItems,
      totalPages: Math.ceil(totalItems / pagination.limit),
    };
  }

  async findById(id: string, ownerId: string): Promise<Product | null> {
    const getProductByIdUseCase = new GetProductByIdUseCase(this.repository, this.#logger);
    const product = await getProductByIdUseCase.execute(id, ownerId);

    if (product === null) throw new ProductNotFoundError(id);
    return product;
  }

  async update(product: Partial<Product>, ownerId: string): Promise<Product> {
    if (product._id === undefined) throw new SystemError('Id is required');
    this.#logger.info(`Validating product: ${product._id}`);
    const getProductByIdUseCase = new GetProductByIdUseCase(this.repository, this.#logger);
    const productValidation = await getProductByIdUseCase.execute(product._id, ownerId);

    if (productValidation === null) throw new ProductNotFoundError(product._id);
    this.#logger.info(`Product: ${product._id} validated`);

    const updateProductUseCase = new UpdateProductUseCase(this.repository, this.#logger);
    await updateProductUseCase.execute(product);

    return {
      ...productValidation,
      ...product,
    };
  }

  async delete(id: string, ownerId: string): Promise<void> {
    this.#logger.info(`Validating product: ${id}`);
    const getProductByIdUseCase = new GetProductByIdUseCase(this.repository, this.#logger);
    const productValidation = await getProductByIdUseCase.execute(id, ownerId);

    if (productValidation === null) throw new ProductNotFoundError(id);

    this.#logger.info(`Product: ${id} validated`);
    const deleteProductUseCase = new DeleteProductUseCase(this.repository, this.#logger);
    await deleteProductUseCase.execute(id);
  }
}
