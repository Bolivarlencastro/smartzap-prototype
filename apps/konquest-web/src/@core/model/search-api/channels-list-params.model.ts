import { PageParams } from './page-params.model';

export interface ChannelsListParams extends PageParams {
  channel_category?: string[];
  active?: boolean;
  managed?: boolean;
  subscribed?: boolean;
  language?: string[];
  bookmarked?: boolean;
}
