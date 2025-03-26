import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { MongoClient, type Db } from 'mongodb';
import { EnvironmentService } from '../environment';

@Injectable()
export class MongoClientProvider implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;

  constructor(private readonly environmentService: EnvironmentService) {}

  async onModuleInit(): Promise<void> {
    const { MONGO_URI, MONGO_DB_NAME } = await this.environmentService.getConfig();
    this.client = new MongoClient(MONGO_URI);
    await this.client.connect();
    this.db = this.client.db(MONGO_DB_NAME);
  }

  getDatabase(): Db {
    return this.db;
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }
}
