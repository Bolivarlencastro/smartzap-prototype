import { Enrollment } from '../../kp-mission-model/model';

export interface EnrollmentFilter {
  user?: string;
  status?: string[];
  search?: string;
  per_page?: number;
  page?: number;
  performance__lte?: string;
  start_date__gte?: string;
  start_date__lte?: string;
  end_date__gte?: string;
  end_date__lte?: string;
  ordering?: string;
  mission?: string;
  mission_id?: string;
  give_up?: boolean;
}

export interface ExecuteAction {
  item: Enrollment;
  action: MobileEnrollmentActions;
}

export type MobileEnrollmentActions =
  | 'viewMission'
  | 'viewTrail'
  | 'continue'
  | 'reEnroll'
  | 'extendDeadline'
  | 'generateCertificate'
  | 'retake'
  | 'giveUp';
