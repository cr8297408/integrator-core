import { Injectable } from "@nestjs/common";
import { ProductRepositoryPort } from "../../../core/domain/ports/product-repository";
import { Product } from "../../../core/domain/entities/product";
import { MongoClientProvider } from "../mongo-client.provider";

@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  private collection = "products";

  constructor(private readonly mongoClientProvider: MongoClientProvider) {}

  async save(product: Product): Promise<void> {
    const db = this.mongoClientProvider.getDatabase();
    await db.collection<Product>(this.collection).insertOne(product);
  }

  async find(): Promise<Product[]> {
    const db = this.mongoClientProvider.getDatabase();
    return await db.collection<Product>(this.collection).find().toArray();
  }

  async findById(id: string): Promise<Product | null> {
    const db = this.mongoClientProvider.getDatabase();
    return await db.collection<Product>(this.collection).findOne({ id });
  }

  async update(product: Product): Promise<void> {
    const db = this.mongoClientProvider.getDatabase();
    await db.collection<Product>(this.collection).updateOne(
      { id: product.id },
      { $set: product }
    );
  }

  async delete(id: string): Promise<void> {
    const db = this.mongoClientProvider.getDatabase();
    await db.collection<Product>(this.collection).deleteOne({ id });
  }
}
