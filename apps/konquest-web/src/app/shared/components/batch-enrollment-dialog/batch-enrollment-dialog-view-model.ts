import { BatchEnrollmentViewMode } from './models/batch-enrollment-view-mode';
import { EnrollmentConfig } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { BatchEnrollmentType } from '@app/shared/services/batch-enrollment.service';
import { BasicUserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface BatchEnrollmentDialogViewModel {
  viewMode: BatchEnrollmentViewMode;
  users: BasicUserProfile[];
  totalItems: number;
  isLoading: boolean;
  isProcessing: boolean;
  selectedIds: Record<string, string>;
  enrollmentConfig: EnrollmentConfig;
  submitDisabled: boolean;
  notFounds: string[];
  selectionSize: number;
  successfullyEnrolledTotal: number;
  enrolledCount?: number;
  type: BatchEnrollmentType;
  reachedLimitSeats: boolean;
  remainingSeats: number;
}
