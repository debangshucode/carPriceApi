import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys:['asdfghnh']
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true, //remove extra properties autometicaly in requests 
    }),
  )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
