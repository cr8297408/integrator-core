import { Injectable } from '@nestjs/common';
import { type User } from '../../../core/domain/entities/user';
import { type UserRepositoryPort } from '../../../core/domain/ports/user-repository';
import { MongoClientProvider } from '../mongo-client.provider';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  private readonly collection = 'users';

  constructor(private readonly mongoClientProvider: MongoClientProvider) {}

  async save(user: Omit<User, '_id'>): Promise<void> {
    const db = this.mongoClientProvider.getDatabase();
    await db.collection(this.collection).insertOne(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = this.mongoClientProvider.getDatabase();
    return await db.collection<User>(this.collection).findOne({ email });
  }
}
