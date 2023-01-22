import {
  SortOrder,
  PopulateOptions,
  QueryOptions,
  ProjectionType,
} from 'mongoose';
export interface PaginateOptions {
  options?: QueryOptions;
  select?: string | any;
  projection?: ProjectionType<string>;
  pagination?: boolean;
  lean?: boolean;
  skip?: number;
  page?: number;
  limit?: number;
  sort?:
    | string
    | { [key: string]: SortOrder | { $meta: 'textScore' } }
    | [string, SortOrder][]
    | undefined
    | null;
  populate?: PopulateOptions | (PopulateOptions | string)[];
}

export interface PaginationMeta {
  limit: number;
  page: number;
  totalPages: number;
  count: number;
  counter: number;
  prevPage: number;
  nextPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface Pagination<T> {
  docs: T[];
  pagination: PaginationMeta;
}
