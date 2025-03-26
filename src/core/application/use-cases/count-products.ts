import { ILoggerPort } from "src/core/domain/ports/logger";
import { ProductRepositoryPort } from "src/core/domain/ports/product-repository";

export class CountProductsUseCase {
    constructor(private readonly productRepository: ProductRepositoryPort, private readonly logger: ILoggerPort) { }

    async execute(userId: string): Promise<number> {
        this.logger.info('Executing count products use case');
        const count = await this.productRepository.count(userId);
        this.logger.info('Count products use case executed');
        return count;
    }
}