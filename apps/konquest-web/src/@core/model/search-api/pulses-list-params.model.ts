import { PageParams } from './page-params.model';

export interface PulsesListParams extends PageParams {
  channel_id?: string;
  channel_category?: string[];
  pulse_type?: string[];
  language?: string[];
  bookmarked?: boolean;
}
