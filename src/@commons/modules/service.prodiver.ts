import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { resolve } from 'app-root-path';
import * as grpc from '@grpc/grpc-js';

import {
  MIFOS_PACKAGE_NAME,
  MIFOS_SERVICE_NAME,
} from '../../services/mifos/mifos.pb';

import {
  BUSINESS_PACKAGE_NAME,
  BUSINESS_SERVICE_NAME,
} from '../../services/businesses/businesses.pb';
import {
  ACCOUNT_SERVICE_NAME,
  ACCOUNTS_PACKAGE_NAME,
} from '../../services/accounts/accounts.pb';
import {
  USER_SERVICE_NAME,
  USERS_PACKAGE_NAME,
} from '../../services/users/users.pb';
import {
  TRANSACTION_SERVICE_NAME,
  TRANSACTIONS_PACKAGE_NAME,
} from '../../services/transactions/transactions.pb';

export const mifosServiceProvider = {
  name: MIFOS_SERVICE_NAME,
  provide: MIFOS_SERVICE_NAME,
  useFactory: async (config: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: config.get<string>('MIFOS_SERVICE_URL'),
        package: MIFOS_PACKAGE_NAME,
        protoPath: resolve('proto/mifos/mifos.proto'),
        //credentials: grpc.ChannelCredentials.createSsl(),
      },
    });
  },
  inject: [ConfigService],
};

export const businessServiceProvider = {
  name: BUSINESS_SERVICE_NAME,
  provide: BUSINESS_SERVICE_NAME,
  useFactory: async (config: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: config.get<string>('BUSINESS_SERVICE_URL'),
        package: BUSINESS_PACKAGE_NAME,
        protoPath: resolve('proto/businesses/businesses.proto'),
        credentials: grpc.ChannelCredentials.createSsl(),
      },
    });
  },
  inject: [ConfigService],
};

export const accountServiceProvider = {
  name: ACCOUNT_SERVICE_NAME,
  provide: ACCOUNT_SERVICE_NAME,
  useFactory: async (config: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: config.get<string>('ACCOUNT_SERVICE_URL'),
        package: ACCOUNTS_PACKAGE_NAME,
        protoPath: resolve('proto/accounts/accounts.proto'),
        credentials: grpc.ChannelCredentials.createSsl(),
      },
    });
  },
  inject: [ConfigService],
};
export const userServiceProvider = {
  name: USER_SERVICE_NAME,
  provide: USER_SERVICE_NAME,
  useFactory: async (config: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: config.get<string>('USER_SERVICE_URL'),
        package: USERS_PACKAGE_NAME,
        protoPath: resolve('proto/users/users.proto'),
        credentials: grpc.ChannelCredentials.createSsl(),
      },
    });
  },
  inject: [ConfigService],
};
export const transactionServiceProvider = {
  name: TRANSACTION_SERVICE_NAME,
  provide: TRANSACTION_SERVICE_NAME,
  useFactory: async (config: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: config.get<string>('TRANSACTION_SERVICE_URL'),
        package: TRANSACTIONS_PACKAGE_NAME,
        protoPath: resolve('proto/transactions/transactions.proto'),
        credentials: grpc.ChannelCredentials.createSsl(),
      },
    });
  },
  inject: [ConfigService],
};

export const SERVICE_PROVIDERS = [
  mifosServiceProvider,
  accountServiceProvider,
  userServiceProvider,
  businessServiceProvider,
  transactionServiceProvider,
];
