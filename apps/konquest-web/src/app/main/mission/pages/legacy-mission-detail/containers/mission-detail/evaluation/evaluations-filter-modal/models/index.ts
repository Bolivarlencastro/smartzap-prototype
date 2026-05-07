import { KpFilterControllerState } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';

export interface EvaluationsFilter {
  mission__id?: string;
  created_date?: string;
  created_date__gte?: string;
  created_date__lte?: string;
  sentiment_analysis?: string;
}

export interface EvaluationsFilterResult {
  filter: EvaluationsFilter;
  controllerState: KpFilterControllerState;
}
