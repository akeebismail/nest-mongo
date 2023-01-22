import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { DynamicModule } from '@nestjs/common';
import * as pluralize from 'mongoose/lib/helpers/pluralize';

export class DatabaseModule extends MongooseModule {
  static forFeature(
    models?: ModelDefinition[],
    connectionName?: string,
  ): DynamicModule {
    const collections = models.map((model) => {
      const name = pluralize(model.name);
      model.collection = name;
      return model;
    });
    return MongooseModule.forFeature(collections, connectionName);
  }
}
