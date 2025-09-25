import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Actualiza el CORS para incluir tu dispositivo móvil
  app.enableCors({
    origin: [
      'http://localhost:3000',        // Tu frontend web
      'http://192.168.1.214:3000',    // Tu frontend web desde la red local
      // Para desarrollo móvil, permitir cualquier origen desde tu red local
      /^http:\/\/192\.168\.1\.\d+/,   // Cualquier IP de tu red local
      'http://192.168.1.214:8081',    // Puerto típico de Expo
      'http://localhost:8081',        // Expo local
    ],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  await app.listen(8000, '0.0.0.0');
  console.log('🚀 Backend corriendo en http://0.0.0.0:8000');
}
bootstrap();