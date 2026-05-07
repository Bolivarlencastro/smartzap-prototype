export type ReportFiltersSearchType =
  | 'categories'
  | 'missions'
  | 'trails'
  | 'providers'
  | 'users'
  | 'creators'
  | 'leaders'
  | 'channels'
  | 'groups'
  | 'activityAreas'
  | 'managers'
  | 'directors'
  | 'jobs'
  | 'jobFunctions';

export interface ReportFiltersSearch {
  searchType: ReportFiltersSearchType;
  search: string;
}
