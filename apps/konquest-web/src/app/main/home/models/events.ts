import { QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';

export interface EventsFilter {
  page: number;
  per_page: number;
  search?: string;
  type?: QuickFilterType;
  categories?: string[];
  languages?: string[];
}

export interface EventsViewModel {
  events: LearnContentCardData[];
  loading: boolean;
}
