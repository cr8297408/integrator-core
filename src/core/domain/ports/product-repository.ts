import { type PaginationInput } from './product-service';
import { type Product } from '../entities/product';

export interface ProductRepositoryPort {
  save: (product: Product) => Promise<void>;
  find: (userId: string, pagination: PaginationInput) => Promise<Product[]>;
  findById: (id: string, ownerId: string) => Promise<Product | null>;
  update: (product: Partial<Product>) => Promise<void>;
  count: (userId: string) => Promise<number>;
  delete: (id: string) => Promise<void>;
}
