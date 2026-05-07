import { Led } from './led';

export interface OverviewSummary {
  totalEnrollments: number;
  activeLedRate: number;
  completionRate: number;
  averageHoursPerLed: number;
  requiredCoursesProgress: number;
}

export interface OverviewTeamSummary {
  requiredEnrollments: OverviewTeamSummaryItem[];
  optionalEnrollments: OverviewTeamSummaryItem[];
  inactiveLed: OverviewTeamSummaryItem[];
  expiringRegulations: OverviewTeamSummaryItem[];
  teamRanking: OverviewTeamSummaryItem[];
}

export interface OverviewTeamSummaryItem extends Led {
  subtitle: string;
  data: unknown;
  description?: string;
}

export interface OverviewViewModel {
  summary: OverviewSummary;
  summaryLoading: boolean;
  teamSummary: OverviewTeamSummary;
  teamSummaryLoading: boolean;
  hasGamification: boolean;
  hasNormative: boolean;
}
