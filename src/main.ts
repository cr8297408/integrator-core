import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, type OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import { AppModule } from './app.module';
import { EnvironmentModule, EnvironmentService } from './infraestructure/environment';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  const environmentService = app.select(EnvironmentModule).get(EnvironmentService);
  const { API_PORT } = await environmentService.getConfig();

  const config = new DocumentBuilder()
    .setTitle('Integrator service API documentation')
    .setDescription('This service manage user authentication and products catalog')
    .setVersion('1.0')
    .build();
  const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: '/docs/json',
  });

  app.use(json());
  await app.init();
  void app.listen(API_PORT ?? 3000);
}
void bootstrap();
