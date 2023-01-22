import {
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
  ProjectionType,
} from 'mongoose';
import { PaginateOptions, Pagination, PaginationMeta } from './paginate.types';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  model() {
    return this.entityModel;
  }
  async findById(id: any, projection?: Record<string, unknown>) {
    return this.entityModel
      .findById(id, {
        __v: 0,
        ...projection,
      })
      .lean();
  }
  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel
      .findOne(entityFilterQuery, {
        __v: 0,
        ...projection,
      })
      .exec();
  }

  async find(entityFilterQuery?: FilterQuery<T>): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery).lean();
  }

  async create(createEntityData: unknown): Promise<T> {
    const entity = new this.entityModel(createEntityData);
    return entity.save();
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
    updateOptions?: QueryOptions,
  ): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(
      entityFilterQuery,
      updateEntityData,
      {
        new: true,
        ...updateOptions,
      },
    );
  }
  async findByIdAndUpdate(
    id: any,
    updateEntityData: UpdateQuery<T>,
    updateOptions?: QueryOptions,
  ): Promise<T | null> {
    return this.entityModel.findByIdAndUpdate(id, updateEntityData, {
      new: true,
      ...updateOptions,
    });
  }
  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }

  async findOneAndDelete(filter: FilterQuery<T>): Promise<boolean> {
    return this.entityModel.findOneAndDelete(filter);
  }

  async findByIdAndDelete(id: any): Promise<boolean> {
    return this.entityModel.findByIdAndDelete(id);
  }

  /**
   *
   * @param filter
   * @param options
   * @param {Object|String}       [options.select='']
   * @param {Object|String}       [options.projection={}]
   * @param {Object}              [options.options={}]
   * @param {Object|String}       [options.sort]
   * @param {Array|Object|String} [options.populate]
   * @param {Boolean}             [options.lean=false]
   * @param {Number}              [options.page=1]
   * @param {Number}              [options.limit=10]
   */
  paginate(
    filter?: FilterQuery<T>,
    options?: PaginateOptions,
  ): Promise<Pagination<T>> {
    let pagination = options.pagination;
    if (!pagination) {
      pagination = true;
    }
    let limit = options.limit ? options.limit : 0;
    if (pagination) {
      limit = options.limit ? options.limit : 0;
    }
    let offset;
    let page;
    let skip;

    let docsPromise;
    if (options.page) {
      page = options.page < 1 ? 1 : options.page;
      skip = (page - 1) * limit;
    } else {
      offset = 0;
      page = 1;
      skip = offset;
    }

    const countPromise = this.entityModel.countDocuments(filter).exec();
    if (!pagination) {
      page = 1;
    }
    if (limit) {
      const mQuery = this.entityModel.find(
        filter,
        options.projection,
        options.options,
      );
      if (options.populate) {
        mQuery.populate(options.populate);
      }
      mQuery.select(options.select);
      mQuery.sort(options.sort);
      mQuery.lean(options.lean);
      if (pagination) {
        mQuery.skip(skip);
        mQuery.limit(limit);
      }
      docsPromise = mQuery.exec();
    }

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [count, docs] = values;

      // Setting default values
      const meta: PaginationMeta = {
        count,
        limit: count,
        totalPages: 1,
        page,
        counter: (page - 1) * limit + 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      };

      const pages = limit > 0 ? Math.ceil(count / limit) || 1 : null;
      if (pagination) {
        meta.limit = limit;
        meta.totalPages = pages;

        // Set prev page
        if (page > 1) {
          meta.hasPrevPage = true;
          meta.prevPage = page - 1;
        } else if (page == 1 && typeof offset !== 'undefined' && offset !== 0) {
          meta.hasPrevPage = true;
          meta.prevPage = 1;
        }

        // Set next page
        if (page < pages) {
          meta.hasNextPage = true;
          meta.nextPage = page + 1;
        }
      }

      if (limit == 0) {
        meta.limit = 0;
        meta.totalPages = 1;
        meta.page = 1;
        meta.counter = 1;
        meta.prevPage = null;
        meta.nextPage = null;
        meta.hasPrevPage = false;
        meta.hasNextPage = false;
      }
      const result = {
        docs,
        pagination: meta,
      };
      return Promise.resolve(result);
    });
  }
}
