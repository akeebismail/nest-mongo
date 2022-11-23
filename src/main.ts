import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {resolve} from 'app-root-path'
import {ServiceExceptionFilterFilter} from "./@commons/filter/service-exception-filter.filter";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
          package: 'service',
          protoPath: resolve('proto/service-name'),
          url: `0.0.0.0:${process.env.PORT}`
        }
      }
  );
  app.useGlobalFilters(new ServiceExceptionFilterFilter());
  app.useGlobalPipes(new ValidationPipe())
  await app.listen();
}
bootstrap();
