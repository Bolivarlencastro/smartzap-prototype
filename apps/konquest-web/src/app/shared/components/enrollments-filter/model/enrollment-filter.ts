import {
  KpFilterControllerState,
  KpFilterSelectOption,
} from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';

export interface EnrollmentFilter {
  status?: string[];
  start_date?: string;
  start_date__gte?: string;
  start_date__lte?: string;
  end_date?: string;
  end_date__gte?: string;
  end_date__lte?: string;
  performance__lte?: string;
  performance__gte?: string;
  created_date?: string;
  created_date__gte?: string;
  created_date__lte?: string;
  event_date?: string;
  event_date__gte?: string;
  event_date__lte?: string;
  mission_category?: KpFilterSelectOption[] | string[];
  instructor?: KpFilterSelectOption[] | string[];
}

export interface EnrollmentFilterResult {
  filter: EnrollmentFilter;
  controllerState: KpFilterControllerState;
}

export interface MissionEnrollmentFilterOptions {
  mission: KpFilterSelectOption[];
  user: KpFilterSelectOption[];
  director: KpFilterSelectOption[];
  manager: KpFilterSelectOption[];
  activity_area: KpFilterSelectOption[];
}

export interface EnrollmentFiltersSearch {
  searchType: EnrollmentFiltersSearchType;
  search: string;
}

export type EnrollmentType = 'MISSION' | 'LEARNING_TRAIL' | 'EVENT';
export type EnrollmentFiltersSearchType = 'categories' | 'instructors';
