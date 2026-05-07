export interface EnrollmentPage {
  per_page?: string;
  page?: string;
}

export interface EnrollmentFilter {
  ordering?: string;
  performance__lte?: string;
  status?: string[];
  start_date__gte?: string;
  start_date__lte?: string;
  end_date__gte?: string;
  end_date__lte?: string;
}

export type TrainigEnrollmentFilter = Omit<EnrollmentFilter, 'end_date__gte' | 'end_date__lte' | 'performance__lte'>;

export type SkilledEnrollmentFilter = Omit<EnrollmentFilter, 'status'>;

export interface TrainigEnrollmentQueryParams extends EnrollmentPage, TrainigEnrollmentFilter {}

export interface SkilledEnrollmentQueryParams extends EnrollmentPage, SkilledEnrollmentFilter {}
