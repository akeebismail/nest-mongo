import { resolve } from 'app-root-path';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from '../../config/app.config';
import { KafkaModule } from '../kafka/kafka.module';
import { User, UserSchema } from '../../schemas/user.schema';
import {UserRepository} from "../../user/user.repository";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    KafkaModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: config.get<string>('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class GlobalModule {}
