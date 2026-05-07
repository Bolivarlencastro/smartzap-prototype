import { PageParams } from '@core/model/search-api';

import { Pulse } from './pulse';

export interface PulsesListParams {
  channel_id?: string;
  channel_category?: string[];
  pulse_type?: string[];
  language?: string[];
  bookmarked?: boolean;
  cursor?: string;
  per_page?: number;
}

export interface PulsesListResponse {
  items: Pulse[];
  next_cursor: string | null;
}

export interface ChannelsListParams extends PageParams {
  channel_category?: string[];
  active?: boolean;
  managed?: boolean;
  subscribed?: boolean;
  language?: string[];
  bookmarked?: boolean;
}
