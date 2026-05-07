import { Report } from '@core/api/model';

export interface LatestReportsResponse {
  result: Report[];
  total_pages: number;
}
