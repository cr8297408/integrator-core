import { Product } from "src/core/domain/entities/product";
import { ProductRepositoryPort } from "src/core/domain/ports/product-repository";
import { ILoggerPort } from "src/core/domain/ports/logger";
import { PaginationInput } from "src/core/domain/ports/product-service";

export class GetProductsUseCase {
    constructor(private readonly productRepository: ProductRepositoryPort, private readonly logger: ILoggerPort) { }

    async execute(userId: string, pagination: PaginationInput): Promise<Product[]> {
        this.logger.info('Executing get products use case');
        const products = await this.productRepository.find(userId, pagination);
        this.logger.info('Get products use case executed');
        return products;
    }
}