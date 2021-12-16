import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(
    {
      // whitelist: true,        //strip out all unneccessary payload outside the dto fromat from POSTed body 
      transform: true,        //transform returned payload to the correct instance from their own respective dto
      // forbidNonWhitelisted: true,    //if detected any unneccessary payload field inside body, will throws an error
      transformOptions:
      {
        enableImplicitConversion: true,   //quesry parameter changed automatically their own respective type
      },
    }
  ));
  await app.listen(3000);
}
bootstrap();
