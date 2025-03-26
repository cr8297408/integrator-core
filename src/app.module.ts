import { Module } from "@nestjs/common";
import { MongoModule } from "./infraestructure/mongodb/mongo.module";
import { AuthController } from "./infraestructure/http/controller/auth";
import { EnvironmentModule, EnvironmentService } from "./infraestructure/environment";
import { ConfigModule } from "@nestjs/config";
import { AuthServiceAdapter } from "./infraestructure/adapters/auth-service";
import { PasswordHasherAdapter } from "./infraestructure/adapters/password-hasher";
import { UserRepositoryAdapter } from "./infraestructure/mongodb/adapters/user-repository";
import { APP_FILTER } from "@nestjs/core";
import { SystemErrorExceptionFilter } from "./infraestructure/http/exception-filters/system-error";
import { JWTAdapter } from "./infraestructure/adapters/jwt";
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from "./infraestructure/http/exception-filters/auth-guard";
import { ProductController } from "./infraestructure/http/controller/product";
import { ProductServiceAdapter } from "./infraestructure/adapters/product-service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongoModule,
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
    })
  ],
  controllers: [AuthController, ProductController],
  providers: [AuthServiceAdapter, PasswordHasherAdapter, UserRepositoryAdapter, ProductServiceAdapter, JWTAdapter, JwtAuthGuard, {
    provide: APP_FILTER,
    useClass: SystemErrorExceptionFilter,
  }],
})
export class AppModule {}
