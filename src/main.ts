import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (app.get(ConfigService).get('NODE_ENV') !== 'production') {
    setupSwagger(app);
  }

  const port = Number.parseInt(process.env.PORT) || 3000;
  await app.listen(port);
  Logger.log(`🚀🚀 on: ${await app.getUrl()}`);
}
bootstrap();
