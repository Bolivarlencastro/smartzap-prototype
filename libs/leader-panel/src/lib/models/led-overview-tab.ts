export interface LedOverviewTabModel {
  id: string;
  overdue_training: number;
  due_soon_training: number;
  last_activity: number;
  completed_enrollments: number;
  total_enrollments: number;
  completion_rate: number;
  ranking_points: number;
  ranking_position: number;
  chart: unknown;
}

export interface LedOverviewTabViewModel {
  loading: boolean;
  data: LedOverviewTabModel;
}
