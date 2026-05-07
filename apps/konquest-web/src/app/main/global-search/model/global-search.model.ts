import { PulseType } from '@core/model/pulse.model';
import { GlobalSearchItem } from '@keeps-platform-frontend-workspace/ui/kp-global-search-item';

export interface ItemsResponse {
  items: GlobalSearchItem[];
  count: number;
  next: boolean;
}

export interface GlobalSearchContentNavigate {
  id: string;
  mission_model?: string;
  external_url?: string;
  pulse_type?: PulseType | string;
}
