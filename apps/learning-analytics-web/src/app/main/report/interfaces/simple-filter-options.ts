import { SimpleFilterListItem } from './simple-filter-list-item';

export interface SimpleFilterOptions {
  items: SimpleFilterListItem[];
  loaded: boolean;
  count: number;
}
