import { EnrollmentConfig } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';

export interface GroupSubmitData {
  selectedItems: string[];
  enrollment?: EnrollmentConfig;
}

export interface RemoveDialogActionData {
  ok: boolean;
  removeEnrollments?: boolean;
}
