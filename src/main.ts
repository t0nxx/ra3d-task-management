import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * Swagger Documentation Config
   */
  const config = new DocumentBuilder()
    .setTitle('ra3d task management')
    .setDescription('The ra3d API description')
    .setVersion('1.0')
    .addTag('ra3d')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /**
   *  App GlobalPipes
   */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  /**
   * helmet
   */
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
