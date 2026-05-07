export interface PageDto<T> {
  page: number;
  total: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: Array<T>;
}
