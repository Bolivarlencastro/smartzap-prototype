import { CompliancesBaseFilter } from './compliances-base-filter';
import { EnrollmentCycleStatus } from './enrollment-cycle-dto';

export type EnrollmentsCyclesFilter = CompliancesBaseFilter & {
  deadline?: string;
  deadlineGte?: string;
  deadlineLte?: string;
  complianceId?: string;
  learningObjectId?: string;
  userId?: string;
  relatedUserLeaderId?: string;
  status?: EnrollmentCycleStatus[];
};

export interface EnrollmentsCyclesFilterDto {
  page?: number;
  limit?: number;
  'filter.status'?: string;
  'filter.deadline'?: string[];
  'filter.cycleId'?: string;
  'filter.enrollment.user.id'?: string;
  'filter.enrollment.learningObject.id'?: string;
  'filter.enrollment.user.relatedUserLeader.id'?: string;
  'filter.cycle.compliance.id'?: string;
  sortBy?: string;
  search?: string;
  searchBy?: string;
  select?: string;
}
