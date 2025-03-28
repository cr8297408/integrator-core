import { Product, ProductStatus } from '../../../core/domain/entities/product';
import { type ILoggerPort } from '../../../core/domain/ports/logger';
import { type ProductRepositoryPort } from '../../../core/domain/ports/product-repository';

export class CreateProductUseCase {
  constructor(
    private readonly repository: ProductRepositoryPort,
    private readonly logger: ILoggerPort
  ) { }

  async execute(productInput: Pick<Product, 'name' | 'price' | 'ownerId'>, validated: boolean): Promise<Product> {
    const product = new Product();
    product.name = productInput.name;
    product.price = productInput.price;
    product.ownerId = productInput.ownerId;
    product.createdAt = new Date();
    product.status = ProductStatus.ACTIVE;
    product.isValidated = validated;
    this.logger.info('Creating product');
    await this.repository.save(product);
    this.logger.info('Product created');

    return product;
  }
}
