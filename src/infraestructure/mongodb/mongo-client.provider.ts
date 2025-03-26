import { MongoClient, Db } from "mongodb";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { EnvironmentService } from "../environment";

@Injectable()
export class MongoClientProvider implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;

  constructor(private readonly environmentService: EnvironmentService) {}

  async onModuleInit() {
    const { MONGO_URI, MONGO_DB_NAME } = await this.environmentService.getConfig();
    this.client = new MongoClient(MONGO_URI);
    await this.client.connect();
    this.db = this.client.db(MONGO_DB_NAME);
  }

  getDatabase(): Db {
    return this.db;
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
