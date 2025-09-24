import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // Habilita el uso de cookies
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Habilita la validación global de DTOs
  app.use(cookieParser());
  await app.listen(8000, '0.0.0.0');
}
bootstrap();
