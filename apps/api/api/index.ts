import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

let cachedServer;

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.use(cookieParser());
    
    // Zaktualizuj origin, aby akceptował żądania z Twojej domeny frontendowej na Vercelu
    nestApp.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    });

    await nestApp.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async function handler(req, res) {
  const server = await bootstrapServer();
  return server(req, res);
}
