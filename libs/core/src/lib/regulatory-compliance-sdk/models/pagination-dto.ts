export interface PaginationDto<T> {
  data: T[];
  links: unknown;
  meta: PaginationDtoMeta;
}

interface PaginationDtoMeta {
  currentPage: number;
  itemsPerPage: number;
  sortBy: unknown[];
  totalItems: number;
  totalPages: number;
}
