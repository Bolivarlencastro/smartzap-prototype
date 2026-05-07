import { Sort } from '@angular/material/sort';

export interface ListFilter {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: Sort;
}

export interface ListViewModel<T> {
  data: T[];
  loading: boolean;
  filter?: ListFilter;
  count?: number;
}
