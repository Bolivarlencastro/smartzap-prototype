import { Page } from '@app/shared/model';

export interface DatatableQuery {
  pagination: Page;
  searchTerm: string;
  sort?: string;
}

export interface UsersFilter {
  tags: string[];
  synced: string[];
}
export interface PageEvent {
  page: number;
  per_page: number;
}

export interface User {
  email: string;
  id: string;
  name: string;
  phone: string;
  tags: string;
  selected?: boolean;
  sync_check?: string | null;
  department?: string;
  sub_department?: string;
  area?: string;
  leader?: string;
}
