import { Injectable } from "@nestjs/common";
import { ProductRepositoryPort } from "../../../core/domain/ports/product-repository";
import { Product, ProductStatus } from "../../../core/domain/entities/product";
import { MongoClientProvider } from "../mongo-client.provider";
import { PaginationInput } from "src/core/domain/ports/product-service";
import { ObjectId } from "mongodb";

@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  private collection = "products";

  constructor(private readonly mongoClientProvider: MongoClientProvider) {}

  async save(product: Product): Promise<void> {
    const db = this.mongoClientProvider.getDatabase();
    await db.collection<Product>(this.collection).insertOne(product);
  }

  async find(userId: string, pagination: PaginationInput): Promise<Product[]> {
    const db = this.mongoClientProvider.getDatabase();
    return await db.collection<Product>(this.collection).find({ ownerId: userId, status: ProductStatus.ACTIVE }, { skip: pagination.skip, limit: pagination.limit }).toArray();
  }

  async findById(id: string, ownerId: string): Promise<Product | null> {
    const db = this.mongoClientProvider.getDatabase();
    let idParsed: ObjectId;
    try {
      idParsed = new ObjectId(id);
    } catch (error) {
      return null;
    }
    return await db.collection(this.collection).findOne({ 
      _id: idParsed, 
      ownerId, 
      status: ProductStatus.ACTIVE 
    }) as unknown as Product;
  }

  async update(product: Partial<Product>): Promise<void> {
    const idParsed = new ObjectId(product._id);
    delete product._id
    console.log(product)
    const db = this.mongoClientProvider.getDatabase();
    await db.collection(this.collection).updateOne(
      { _id: idParsed },
      { $set: product }
    );
  }

  async delete(id: string): Promise<void> {
    const db = this.mongoClientProvider.getDatabase();
    const idParsed = new ObjectId(id);
    await db.collection(this.collection).updateOne({ _id: idParsed }, {
      $set: {
        status: ProductStatus.INACTIVE
      }
    });
  }

  async count(userId: string): Promise<number> {
    const db = this.mongoClientProvider.getDatabase();
    return await db.collection<Product>(this.collection).countDocuments({ ownerId: userId });
  }
}
