import { ProductRepositoryPort } from "src/core/domain/ports/product-repository";
import { ILoggerPort } from "src/core/domain/ports/logger";
import { Product } from "src/core/domain/entities/product";

export class UpdateProductUseCase {
    constructor(
        private readonly repository: ProductRepositoryPort,
        private readonly logger: ILoggerPort
    ) { }

    async execute(product: Partial<Product>): Promise<void> {
        this.logger.info(`Updating product: ${product._id}`);
        await this.repository.update(product);
        this.logger.info(`Product: ${product._id} updated`);
    }
}