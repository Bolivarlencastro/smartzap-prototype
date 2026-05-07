import { ContentTypeTabs } from '../../kp-global-search-list';

export interface GlobalSearchFilterOptions {
  enrollmentFilters: GlobalSearchFilterOptionItem[];
  courseFilters: GlobalSearchFilterOptionItem[];
}

export interface GlobalSearchFilterOptionItem extends GlobalSearchFilterItem {
  icon: string;
  options: GlobalSearchFilterItem[];
  multipleSelection?: boolean;
}

export interface GlobalSearchFilterItem {
  label: string;
  value: string;
}

export interface GlobalSearchFilter {
  page?: number;
  per_page?: number;
  search?: string;
  contentType?: ContentTypeTabs;
  enrollmentType?: string;
  duedate?: string;
  duration?: string;
  enrollmentStatus?: string[];
  categories?: string[];
  platforms?: string[];
}
