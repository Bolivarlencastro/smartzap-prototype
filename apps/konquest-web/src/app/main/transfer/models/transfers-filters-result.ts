import { KpFilterControllerState } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { TransferFilter } from './transfer-filter';

export type TransfersFiltersResult = {
  filter: TransferFilter;
  controllerState: KpFilterControllerState;
};
