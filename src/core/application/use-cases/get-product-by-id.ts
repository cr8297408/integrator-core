import { type Product } from 'src/core/domain/entities/product';
import { type ILoggerPort } from 'src/core/domain/ports/logger';
import { type ProductRepositoryPort } from 'src/core/domain/ports/product-repository';

export class GetProductByIdUseCase {
  constructor(
    private readonly repository: ProductRepositoryPort,
    private readonly logger: ILoggerPort
  ) {}

  async execute(id: string, ownerId: string): Promise<Product | null> {
    this.logger.info(`Getting product by id: ${id}`);
    const product = await this.repository.findById(id, ownerId);
    this.logger.info(`Product by id: ${id} found`);
    return product;
  }
}
