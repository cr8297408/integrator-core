import { Module } from "@nestjs/common";
import { MongoModule } from "./infraestructure/mongodb/mongo.module";
import { AuthController } from "./infraestructure/http/controller/auth";
import { EnvironmentModule } from "./infraestructure/environment";
import { ConfigModule } from "@nestjs/config";
import { AuthService } from "./infraestructure/adapters/auth-service";
import { PasswordHasherAdapter } from "./infraestructure/adapters/password-hasher";
import { UserRepositoryAdapter } from "./infraestructure/mongodb/adapters/user-repository";
import { APP_FILTER } from "@nestjs/core";
import { SystemErrorExceptionFilter } from "./infraestructure/http/exception-filters/system-error";
import { JWTAdapter } from "./infraestructure/adapters/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongoModule,
    EnvironmentModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordHasherAdapter, UserRepositoryAdapter, JWTAdapter, {
    provide: APP_FILTER,
    useClass: SystemErrorExceptionFilter,
  }],
})
export class AppModule {}
