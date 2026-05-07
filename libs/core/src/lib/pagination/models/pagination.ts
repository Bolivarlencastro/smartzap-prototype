export interface Pagination<T> {
  count?: number;
  next?: string;
  previous?: string;
  results?: T[];
}

export interface PageResponse<T> {
  page: number;
  total: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: T[];
}

export interface Paginated<T> {
  data: T[];
  links: PaginatedLinks;
  meta: PaginatedMeta;
}

interface PaginatedLinks {
  current: string;
  last: string;
  next: string;
  previous: string;
  first: string;
}

interface PaginatedMeta {
  current_page: number;
  itemsPerPage: number;
  sortBy: unknown[];
  totalItems: number;
  totalPages: number;
}
