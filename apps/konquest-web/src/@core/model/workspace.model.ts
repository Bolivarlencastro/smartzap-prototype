import { Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';

export type WorkspaceKonquestSettings = Pick<
  Workspace,
  | 'allow_list_public_categories'
  | 'min_performance_certificate'
  | 'enrollment_goal_duration_days'
  | 'block_reenrollment'
>;
