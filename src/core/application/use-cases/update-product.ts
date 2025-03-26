import { type Product } from 'src/core/domain/entities/product';
import { type ILoggerPort } from 'src/core/domain/ports/logger';
import { type ProductRepositoryPort } from 'src/core/domain/ports/product-repository';

export class UpdateProductUseCase {
  constructor(
    private readonly repository: ProductRepositoryPort,
    private readonly logger: ILoggerPort
  ) {}

  async execute(product: Partial<Product>): Promise<void> {
    this.logger.info(`Updating product: ${product._id}`);
    await this.repository.update(product);
    this.logger.info(`Product: ${product._id} updated`);
  }
}
