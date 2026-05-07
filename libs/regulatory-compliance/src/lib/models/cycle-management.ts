import {
  KpFilterControllerState,
  KpFilterSelectOption,
} from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import {
  EnrollmentCycleDto,
  EnrollmentCycleStatus,
  EnrollmentsCyclesFilter,
} from '@keeps-platform-frontend-workspace/kp-keeps';

export interface CycleManagementSort {
  order: 'asc' | 'desc' | '';
  order_by: string;
}

export interface CycleManagementPageChange {
  page: number;
  per_page: number;
}

export interface CycleManagementViewModel {
  items: EnrollmentCycleDto[];
  filter: EnrollmentsCyclesFilter;
  totalItems: number;
  isLoading: boolean;
}

export type CycleActionConfirmationType = 'renew' | 'inactivate';

export type CycleEnrollmentsFilterACType = 'normatives' | 'learningObjects' | 'users' | 'leaders';

export type RawCycleEnrollmentsFilter = {
  deadline?: string | Date;
  deadlineGte?: string | Date;
  deadlineLte?: string | Date;
  complianceId?: KpFilterSelectOption;
  learningObjectId?: KpFilterSelectOption;
  userId?: KpFilterSelectOption;
  relatedUserLeaderId?: KpFilterSelectOption;
  status?: EnrollmentCycleStatus[];
};

export interface CycleEnrollmentsFilterResult {
  filter: RawCycleEnrollmentsFilter;
  controllerState: KpFilterControllerState;
}
