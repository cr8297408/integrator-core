import { HttpModule } from '@nestjs/axios';
import { type MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthServiceAdapter } from './infraestructure/adapters/auth-service';
import { FinancialCoreProxyAdapter } from './infraestructure/adapters/financial-core';
import { JWTAdapter } from './infraestructure/adapters/jwt';
import { PasswordHasherAdapter } from './infraestructure/adapters/password-hasher';
import { ProductServiceAdapter } from './infraestructure/adapters/product-service';
import { EnvironmentModule, EnvironmentService } from './infraestructure/environment';
import { AuthController } from './infraestructure/http/controller/auth';
import { ProductController } from './infraestructure/http/controller/product';
import { JwtAuthGuard } from './infraestructure/http/interceptors/auth-guard';
import { LoggerMiddleware } from './infraestructure/http/interceptors/logger';
import { SystemErrorExceptionFilter } from './infraestructure/http/interceptors/system-error';
import { UserRepositoryAdapter } from './infraestructure/mongodb/adapters/user-repository';
import { MongoModule } from './infraestructure/mongodb/mongo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongoModule,
    HttpModule,
    EnvironmentModule,
    JwtModule.registerAsync({
      inject: [EnvironmentService],
      useFactory: async (environmentService: EnvironmentService) => {
        const { AUTH_JWT_SECRET_KEY, AUTH_JWT_EXPIRES_IN } = await environmentService.getConfig();
        return {
          secret: AUTH_JWT_SECRET_KEY,
          signOptions: { expiresIn: AUTH_JWT_EXPIRES_IN },
        };
      },
    }),
  ],
  controllers: [AuthController, ProductController],
  providers: [
    AuthServiceAdapter,
    FinancialCoreProxyAdapter,
    PasswordHasherAdapter,
    UserRepositoryAdapter,
    ProductServiceAdapter,
    JWTAdapter,
    JwtAuthGuard,
    {
      provide: APP_FILTER,
      useClass: SystemErrorExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
