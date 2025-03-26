import { Product } from "../entities/product";
import { PaginationInput } from "./product-service";

export interface ProductRepositoryPort {
    save(product: Product): Promise<void>;
    find(userId: string, pagination: PaginationInput): Promise<Product[]>;
    findById(id: string, ownerId: string): Promise<Product | null>;
    update(product: Partial<Product>): Promise<void>;
    count(userId: string): Promise<number>;
    delete(id: string): Promise<void>;
}