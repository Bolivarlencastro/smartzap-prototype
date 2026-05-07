export * from './courses-list-params.model';
export * from './courses-response.model';
export * from './trails-list-params.model';
export * from './trails-response.model';
export * from './pulses-list-params.model';
export * from './channels-list-params.model';
export * from './channels-response.model';
export * from './page-params.model';

export interface BasicResponse<T> {
  items: T[];
  total: number;
}

export interface PageResponse<T> extends BasicResponse<T> {
  page?: number;
  per_page?: number;
  last_page?: number;
  sort?: string;
  search?: string;
  params?: Record<string, any>;
}
