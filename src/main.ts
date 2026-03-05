import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger'
const cookieSession = require('cookie-session')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger
  const config = new DocumentBuilder()
  .setTitle('Car-Price')
  .setDescription('This is a car price api includes user auth and car repors for make purchase decisions ')
  .setVersion('1.0')
  .addTag('cars')
  .build()

  const documentFactory = ()=> SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,documentFactory);

  
  app.use(cookieSession({
    keys:['asdfghnh']
  }))

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist:true, //remove extra properties autometicaly in requests 
  //   }),
  // ) // its move to appmodule 

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
