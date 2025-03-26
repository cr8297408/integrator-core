import { type IResponseDataHttpList } from 'src/infraestructure/http/model/response-list';
import { type Product } from '../entities/product';

export interface ProductServicePort {
  create: (productInput: Pick<Product, 'name' | 'price'>, ownerId: string) => Promise<Product>;
  findAll: (pagination: PaginationInput, owner: string) => Promise<Omit<IResponseDataHttpList<Product>, 'status'>>;
  findById: (id: string, ownerId: string) => Promise<Product | null>;
  update: (product: Product, ownerId: string) => Promise<Product>;
  delete: (id: string, ownerId: string) => Promise<void>;
}

export interface PaginationInput {
  limit: number;
  skip: number;
}
