import { Product } from "../entities/product";

export interface ProductServicePort {
    create(product: Product): Promise<void>;
    findAll(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    update(product: Product): Promise<void>;
    delete(id: string): Promise<void>;
}
