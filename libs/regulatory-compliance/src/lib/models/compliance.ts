import { ComplianceDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface ComplianceListItem extends ComplianceDto {
  selected?: boolean;
}
