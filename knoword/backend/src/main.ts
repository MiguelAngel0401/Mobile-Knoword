import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ CORS actualizado para ngrok
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://192.168.1.214:3000',
      /^http:\/\/192\.168\.1\.\d+/,
      'http://192.168.1.214:8081',
      'http://localhost:8081',
      'https://unpleading-lawfully-coy.ngrok-free.dev', // ✅ Agrega tu URL de ngrok
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // ✅ Métodos permitidos
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'ngrok-skip-browser-warning', // ✅ Header de ngrok
      'User-Agent',
      'Cookie',
    ],
    exposedHeaders: ['Set-Cookie'], // ✅ Para que las cookies funcionen
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  
  await app.listen(8000, '0.0.0.0');
  console.log('🚀 Backend corriendo en http://0.0.0.0:8000');
}
bootstrap();