import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductRepositoryAdapter } from './adapters/product-repository';
import { UserRepositoryAdapter } from './adapters/user-repository';
import { MongoClientProvider } from './mongo-client.provider';

@Module({
  imports: [ConfigModule],
  providers: [MongoClientProvider, ProductRepositoryAdapter, UserRepositoryAdapter],
  exports: [ProductRepositoryAdapter, UserRepositoryAdapter, MongoClientProvider],
})
export class MongoModule {}
