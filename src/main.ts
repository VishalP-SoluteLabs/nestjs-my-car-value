import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const cookieSession = require('cookie-session')  //require written because it doesn't work well with tsconfig by simply importing it


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: [process.env.COOKIE_KEY]  //string to encrypt the outgoing cookie
  }))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true   //it skips the data other than we expect in request body (eg.- if we write email, pwd, name in signup body,... 
    })                  //....it will only consider email and pwd that we wrote in signup handler, name will be ignored)
  )
  await app.listen(3000);
}
bootstrap();
