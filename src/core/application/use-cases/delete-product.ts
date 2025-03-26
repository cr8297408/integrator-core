import { ILoggerPort } from "src/core/domain/ports/logger";
import { ProductRepositoryPort } from "src/core/domain/ports/product-repository";

export class DeleteProductUseCase {
    constructor(
        private readonly repository: ProductRepositoryPort,
        private readonly logger: ILoggerPort
    ) { }

    async execute(id: string): Promise<void> {
        this.logger.info(`Deleting product: ${id}`);
        await this.repository.delete(id);
        this.logger.info(`Product: ${id} deleted`);
    }
}