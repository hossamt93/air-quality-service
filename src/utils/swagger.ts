import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Pollution } from '../dtos';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Air Quality Service')
    .setDescription('Air Quality API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, { extraModels: [Pollution] });
  SwaggerModule.setup('swagger', app, document);
}
