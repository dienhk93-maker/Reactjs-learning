import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('A comprehensive Todo management API built with NestJS and MongoDB')
    .setVersion('1.0')
    .addServer(`http://localhost:${config.get('services.port')}`, 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(config.get('services.port'), () => {
    console.log(`Server is running on port ${config.get('services.port')}`);
    console.log(`Swagger documentation available at http://localhost:${config.get('services.port')}/docs`);
  });
}
bootstrap();
