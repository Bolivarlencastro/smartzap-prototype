import { buildFilter } from './list-filter.util';
import { ListFilter } from '../models/list';

describe('buildFilter', () => {
  it('should return page and per_page params', () => {
    const filter: ListFilter = { page: 1, per_page: 20 };

    expect(buildFilter(filter)).toEqual({ page: 1, per_page: 20 });
  });

  it('should include search param when provided', () => {
    const filter: ListFilter = { page: 1, per_page: 10, search: 'angular' };

    expect(buildFilter(filter)).toEqual({ page: 1, per_page: 10, search: 'angular' });
  });

  it('should not include search param when search is empty string', () => {
    const filter: ListFilter = { page: 1, per_page: 10, search: '' };

    expect(buildFilter(filter)).toEqual({ page: 1, per_page: 10 });
  });

  it('should include sort_by and sort_order when sort has direction', () => {
    const filter: ListFilter = { page: 1, per_page: 10, sort: { active: 'course_name', direction: 'asc' } };

    expect(buildFilter(filter)).toEqual({ page: 1, per_page: 10, sort_by: 'course_name', sort_order: 'asc' });
  });

  it('should not include sort params when sort direction is empty', () => {
    const filter: ListFilter = { page: 1, per_page: 10, sort: { active: 'course_name', direction: '' } };

    expect(buildFilter(filter)).toEqual({ page: 1, per_page: 10 });
  });

  it('should include all params when filter is fully populated', () => {
    const filter: ListFilter = {
      page: 2,
      per_page: 5,
      search: 'javascript',
      sort: { active: 'enrollment_count', direction: 'desc' },
    };

    expect(buildFilter(filter)).toEqual({
      page: 2,
      per_page: 5,
      search: 'javascript',
      sort_by: 'enrollment_count',
      sort_order: 'desc',
    });
  });
});
