export * from './billing';
export * from './timezone';
export interface BaseEntity {
  id?: string;
  created?: string;
  updated?: string;
}
export interface Page {
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}
export interface CollectionApiResponse<T> extends Page {
  result: T[];
}
export interface CollectionResponse<T> {
  collection: T[];
  page: Page;
}

export const CourseReports: Report[] = [
  { reportType: 'ACTIVITY', translateKey: 'REPORTS.ACTIVITY' },
  { reportType: 'PROGRESS', translateKey: 'REPORTS.PROGRESS' },
  { reportType: 'COMPLETED', translateKey: 'REPORTS.COMPLETED' },
  { reportType: 'QUIZZES', translateKey: 'REPORTS.QUIZZES' },
  { reportType: 'USERS_CONSUMPTION', translateKey: 'REPORTS.USERS_CONSUMPTION' },
];

export const UserReports: Report[] = [{ reportType: 'USERS', translateKey: 'REPORTS.USERS' }];

export type ReportType = 'USERS' | 'PROGRESS' | 'COMPLETED' | 'QUIZZES' | 'ACTIVITY' | 'USERS_CONSUMPTION';

export interface Report {
  reportType: ReportType;
  translateKey: string;
}
