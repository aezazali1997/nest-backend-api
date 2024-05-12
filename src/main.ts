import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    cors:true,
    rawBody:true
  });
  await app.listen(process.env.PORT);
  app.enableCors({
    origin:'*',
  })
}
bootstrap();
