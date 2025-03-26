import { User } from "./user";

export class Product {
  _id: string;
  name: string;
  price: number;
  ownerId: string;
  owner: User;
  isValidated: boolean;
  status: ProductStatus;
  createdAt: Date;
}

export enum ProductStatus { 
  ACTIVE = 'active',
  INACTIVE = 'inactive'
};