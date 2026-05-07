import { TransferAction } from './transfer-action';
import { TransferParty } from './transfer-party';

export interface TransferMission extends TransferParty {
  enrollments: number;
}

export interface Transfer {
  id: string;
  mission: TransferMission;
  manager_user: TransferParty;
  source: TransferParty;
  receiver: TransferParty;
  action: TransferAction;
  created_date: string;
  deleted: boolean;
  deleted_date?: string;
  relation?: string;
  updated_date: string;
  users_enrolled: number;
}
