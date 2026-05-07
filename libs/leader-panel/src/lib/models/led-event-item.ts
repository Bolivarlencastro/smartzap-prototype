import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface LedEventItem {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  presence: boolean;
  development_status: DevelopmentStatus;
}
