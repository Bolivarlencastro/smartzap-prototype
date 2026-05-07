import { Group } from '../groups/group.model';
import { EnrollmentConfig } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';

export interface GroupUser {
  id?: string;
  group: Group;
  user: any;
}

export interface GroupUserActionData {
  groupId: string;
  userIds: string[];
  enrollment?: EnrollmentConfig;
}

export interface GroupUserQueryParams {
  page: number;
  per_page: number;
  ordering?: string;
  search?: string;
  deleted?: boolean;
}
