import { ValidationPipe } from '@nestjs/common'; // Import ValidationPipe
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // Import Swagger modules
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true }); // Enable raw body parsing globally

  // Alternatively, apply raw body parsing only to the webhook path:
  // const app = await NestFactory.create(AppModule);
  // app.use('/payments/webhook', express.raw({ type: 'application/json' })); // Apply raw body middleware to webhook path

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not defined in DTOs
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Aahaar Backend API')
    .setDescription('API documentation for the Aahaar food donation platform')
    .setVersion('1.0')
    .addBearerAuth() // Add JWT Bearer token authentication option
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Serve Swagger UI at /api

  // Enable CORS (configure securely based on requirements)
  app.enableCors({
    origin: process.env.FRONTEND_URL, // Allow requests from frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Allow cookies/auth headers
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
