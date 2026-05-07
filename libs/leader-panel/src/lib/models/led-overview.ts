import { Enrollment } from './enrollment';

export type LedOverViewTabs = 'overview' | 'courses' | 'trails' | 'pulses' | 'channels' | 'events';

export type ConclusionHistory = Record<string, [number, number]>;

export type LedOverview = {
  conclusionHistory: ConclusionHistory;
  totalEnrollments: number;
  finishedEnrollments: number;
  conclusionRate: number;
  points: number;
  rank: number;
};

export type LedEnrollmentsTabViewMode = 'loading' | 'list' | 'details' | 'item-details';

export type LedEnrollmentsTabViewModel = {
  enrollments: Enrollment[];
  viewMode: LedEnrollmentsTabViewMode;
};
