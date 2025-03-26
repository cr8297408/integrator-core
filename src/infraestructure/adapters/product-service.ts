import { Product } from "src/core/domain/entities/product";
import { PaginationInput, ProductServicePort } from "src/core/domain/ports/product-service";
import { IResponseDataHttpList } from "src/infraestructure/http/model/response-list";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { GetProductsUseCase } from "src/core/application/use-cases/get-products";
import { CountProductsUseCase } from "src/core/application/use-cases/count-products";
import { ProductRepositoryAdapter } from "../mongodb/adapters/product-repository";
import { LoggerInstance } from "../shared/logger";
import { CreateProductUseCase } from "src/core/application/use-cases/create-product";
import { GetProductByIdUseCase } from "src/core/application/use-cases/get-product-by-id";
import { UpdateProductUseCase } from "src/core/application/use-cases/update-product";
import { ProductNotFoundError } from "src/core/domain/shared/error/product-not-found";
import { DeleteProductUseCase } from "src/core/application/use-cases/delete-product";
import { CreateProductDto } from "../http/dto/request/CreateProductDto";
import { SystemError } from "src/core/domain/shared/error/system";

@Injectable()
export class ProductServiceAdapter implements ProductServicePort {
    #logger = LoggerInstance
    constructor(private readonly repository: ProductRepositoryAdapter) {}

    async create(productInput: CreateProductDto, ownerId: string): Promise<Product> {
        const createProductUseCase = new CreateProductUseCase(this.repository, this.#logger);
        return await createProductUseCase.execute({
            ...productInput,
            ownerId
        });
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
            totalPages: Math.ceil(totalItems / pagination.limit)
        };
    }
    async findById(id: string, ownerId: string): Promise<Product | null> {
        const getProductByIdUseCase = new GetProductByIdUseCase(this.repository, this.#logger);
        const product = await getProductByIdUseCase.execute(id, ownerId);

        if(product === null) throw new ProductNotFoundError(id);
        return product
    }
    async update(product: Partial<Product>, ownerId: string): Promise<Product> {
        if(product._id === undefined) throw new SystemError('Id is required')
        this.#logger.info(`Validating product: ${product._id}`);
        const getProductByIdUseCase = new GetProductByIdUseCase(this.repository, this.#logger);
        const productValidation = await getProductByIdUseCase.execute(product._id, ownerId);
        
        if (productValidation === null) throw new ProductNotFoundError(product._id);
        this.#logger.info(`Product: ${product._id} validated`);

        const updateProductUseCase = new UpdateProductUseCase(this.repository, this.#logger);
        await updateProductUseCase.execute(product);

        return {
            ...productValidation,
            ...product
        }
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