import { Product } from "../entities/product";

export interface ProductRepositoryPort {
    save(product: Product): Promise<void>;
    find(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    update(product: Product): Promise<void>;
    delete(id: string): Promise<void>;
}