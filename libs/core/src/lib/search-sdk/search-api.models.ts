export interface BasicResponse<T> {
  items: T[];
  total: number;
}

export interface SearchPageResponse<T> extends BasicResponse<T> {
  page?: number;
  per_page?: number;
  last_page?: number;
  sort?: string;
  search?: string;
  params?: Record<string, unknown>;
}
