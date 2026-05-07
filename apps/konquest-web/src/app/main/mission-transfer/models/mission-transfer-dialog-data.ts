import { MissionTransferType } from './mission-transfer-type';
import { Mission } from 'app/main/mission/mission.model';

export interface MissionTransferDialogData {
  transferType: MissionTransferType;
  mission: Mission;
}
