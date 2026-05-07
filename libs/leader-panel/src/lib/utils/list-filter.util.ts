import { ListFilter } from '../models/list';

export function buildFilter(filter: ListFilter) {
  const params: Record<string, unknown> = {
    page: filter.page,
    per_page: filter.per_page,
  };

  if (filter.search) {
    params['search'] = filter.search;
  }

  if (filter.sort?.direction) {
    params['sort_by'] = filter.sort.active;
    params['sort_order'] = filter.sort.direction;
  }

  return params;
}
