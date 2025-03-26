import { Injectable } from "@nestjs/common";
import { UserRepositoryPort } from "../../../core/domain/ports/user-repository";
import { MongoClientProvider } from "../mongo-client.provider";
import { User } from "../../../core/domain/entities/user";

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  private collection = "users";

  constructor(private readonly mongoClientProvider: MongoClientProvider) {}

  async save(user: User): Promise<void> {
    const db = this.mongoClientProvider.getDatabase();
    await db.collection(this.collection).insertOne(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = this.mongoClientProvider.getDatabase();
    return await db.collection<User>(this.collection).findOne({ email });
  }
}
