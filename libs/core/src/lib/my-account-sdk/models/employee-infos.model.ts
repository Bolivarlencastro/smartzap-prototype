export interface EmployeeInfosApiParams {
  perPage: number;
  page: number;
  search: string;
}

export interface EmployeeInfosApiResponse {
  items: string[];
  meta: EmployeeInfosApiMeta;
}

interface EmployeeInfosApiMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type EmployeeInfosType = 'areas-of-activity' | 'directors' | 'managers';
