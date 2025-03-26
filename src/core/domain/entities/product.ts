import { User } from "./user";

export class Product {
  id: string;
  name: string;
  price: number;
  ownerId: string;
  owner: User;
  isValidated: boolean;
  status: ProductStatus;
}

export type ProductStatus = 'active' | 'inactive';