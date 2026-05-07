import { User } from '../../users';
import { ActivityLogStatus } from './activity-log';

type MissionEnrollmentBatchActionKey =
  | 'KONQUEST.FINISH_MSSION_ENROLLMENTS'
  | 'KONQUEST.DELETE_MISSION_ENROLLMENTS'
  | 'KONQUEST.UPDATE_MISSION_ENROLLMENTS_GOAL_DATE'
  | 'KONQUEST.APPROVE_MISSION_ENROLLMENTS'
  | 'KONQUEST.RESTART_MISSION_ENROLLMENTS'
  | 'KONQUEST.RECREATE_MISSION_ENROLLMENTS';

type UserBatchActionKey = 'MYACCOUNT.INVITE_USERS' | 'MYACCOUNT.UPDATE_USERS_STATUS';

type MissionEnrollmentBatchAction =
  | 'APPROVE_ENROLLMENT'
  | 'REJECT_CERTIFICATE'
  | 'RESTART_ENROLLMENT'
  | 'RE_ENROLL_ENROLLMENT'
  | 'GOAL_DATE_ENROLLMENT'
  | 'DELETE_ENROLLMENT';

type UserBatchAction = 'INVITE_USERS' | 'ACTIVATE_USERS' | 'DEACTIVATE_USERS';

type EventUserAttendanceBatchAction = 'ADD_NOTE' | 'SEND_INVITE' | 'REMOVE_USER' | 'MARK_AS_ABSENT' | 'MARK_AS_PRESENT';

export type BatchActionKey = MissionEnrollmentBatchActionKey | UserBatchActionKey;
export type BatchAction = MissionEnrollmentBatchAction | UserBatchAction | EventUserAttendanceBatchAction;

export const BATCH_ACTION_API_KEY: Partial<Record<BatchAction, BatchActionKey>> = {
  APPROVE_ENROLLMENT: 'KONQUEST.FINISH_MSSION_ENROLLMENTS',
  DELETE_ENROLLMENT: 'KONQUEST.DELETE_MISSION_ENROLLMENTS',
  GOAL_DATE_ENROLLMENT: 'KONQUEST.UPDATE_MISSION_ENROLLMENTS_GOAL_DATE',
  REJECT_CERTIFICATE: 'KONQUEST.APPROVE_MISSION_ENROLLMENTS',
  RESTART_ENROLLMENT: 'KONQUEST.RESTART_MISSION_ENROLLMENTS',
  RE_ENROLL_ENROLLMENT: 'KONQUEST.RECREATE_MISSION_ENROLLMENTS',
  INVITE_USERS: 'MYACCOUNT.INVITE_USERS',
  ACTIVATE_USERS: 'MYACCOUNT.UPDATE_USERS_STATUS',
  DEACTIVATE_USERS: 'MYACCOUNT.UPDATE_USERS_STATUS',
};

export interface BatchActionAPIParams {
  actionKey: string;
  objectsTotalExpected: number;
  actionPayload?: unknown;
  queryFilters?: unknown;
  objectIds?: string[];
}

export interface BuildedAction {
  id: BatchAction;
  icon: string;
  iconClass: string;
}

export const ACTION_CONFIG: Record<BatchAction, Pick<BuildedAction, 'icon' | 'iconClass'>> = {
  APPROVE_ENROLLMENT: { icon: 'check', iconClass: 's-5' },
  REJECT_CERTIFICATE: { icon: 'close', iconClass: 's-5' },
  RESTART_ENROLLMENT: { icon: 'fast_rewind', iconClass: 's-5' },
  RE_ENROLL_ENROLLMENT: { icon: 'autorenew', iconClass: 's-5' },
  GOAL_DATE_ENROLLMENT: { icon: 'today', iconClass: 's-5 filled' },
  DELETE_ENROLLMENT: { icon: 'delete', iconClass: 's-5' },
  INVITE_USERS: { icon: 'mail', iconClass: 's-5' },
  ACTIVATE_USERS: { icon: 'check', iconClass: 's-5' },
  DEACTIVATE_USERS: { icon: 'close', iconClass: 's-5' },
  ADD_NOTE: { icon: 'chat', iconClass: 's-5' },
  SEND_INVITE: { icon: 'mail', iconClass: 's-5' },
  REMOVE_USER: { icon: 'person_remove', iconClass: 's-5' },
  MARK_AS_ABSENT: { icon: 'radio_button_unchecked', iconClass: 's-5' },
  MARK_AS_PRESENT: { icon: 'radio_button_checked', iconClass: 's-5' },
};

export interface BatchActionsViewModel {
  actions: BatchAction[];
  isTotalSelected: boolean;
}

export interface BatchActionDTO {
  id: string;
  actionKey: BatchActionKey;
  status: ActivityLogStatus;
  objectsUpdated: number;
  objectsError: number;
  objectsTotal: number;
  actionApplicationId: string;
  workspaceId: string;
  user: Pick<User, 'id' | 'name'>;
  createdDate: string;
  updatedDate: string;
  queryFilters: unknown;
  actionPayload: unknown;
}
