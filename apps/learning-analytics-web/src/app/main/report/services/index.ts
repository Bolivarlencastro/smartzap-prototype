import { FilterGroupAutoCompleteSelectComponent } from '@keeps-platform-frontend-workspace/ui/kp-report-filter-dialog';

export * from './simple-filter-report.service';
export * from './report.service';
export * from './report.service';
export * from './report-filters.service';

export type FetchOptions = 'CHANNELS' | 'USERS' | 'COURSES' | 'MISSION_CATEGORY' | 'MISSION_PROVIDER' | 'GROUPS';

export interface SimpleFilterSubject {
  filterValue: string;
  fetchMethod: FetchOptions;
  params?: Record<string, unknown>;
  autocompleteComponent: FilterGroupAutoCompleteSelectComponent;
}
