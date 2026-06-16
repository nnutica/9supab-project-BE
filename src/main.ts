import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './appfilters/global-exception.filter';
import { LoggingInterceptor } from './appinterceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* CORS - เปิดเฉพาะ frontend origin */
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  });

  /* Global interceptor - สำหรับ log ระยะเวลาการทำงาน */
  app.useGlobalInterceptors(new LoggingInterceptor());

  /* Global validation pipe - class-validator */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /* Global exception filter */
  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 9Supab Backend running on http://localhost:${port}`);
}

bootstrap();
