import { LearnContent, User, UserCreator } from '@core/model';
import { Category } from '@core/model/category.model';

import { ChannelSubscriptionResponse } from './channel';
import { PulseType } from './pulse';

export interface PulseDetailsApiResponse {
  id?: string;
  rating_avg?: number;
  rating_count?: number;
  channels?: { id: string; name: string; category: string }[];
  name: string;
  description?: string;
  holder_image?: string;
  learn_content_uuid: string;
  created_date: string;
  updated_date: string;
  user_creator: UserCreator;
  pulse_type: PulseType;
  duration_time: number;
  points?: number;
  bookmark_id?: string;
  views?: number;
  is_active?: boolean;
  language: string;
  status: string;
}

export interface PulseDetailsApiComment {
  id: string;
  comment: string;
  pulse: unknown;
  user: User;
  created_date: string;
  updated_date?: string;
}

export interface ChannelDetailsApiResponse {
  id: string;
  name?: string;
  is_active?: boolean;
  description?: string;
  holder_image?: string;
  channel_category?: Category;
  workspace?: string;
  enrolled?: boolean;
  rating?: number;
  rating_avg?: number;
  channel_type?: { id: string | number; name: string };
  created_date?: string | Date;
  channel_statistics?: {
    subscribers?: number;
    total_subscribers?: number;
    total_pulses?: number;
    content_type_distribution?: string;
  };
  user_creator?: UserCreator;
  is_contributor?: boolean;
  is_owner?: boolean;
  language?: string;
  rating_count?: number;
  contributors?: User[];
  subscription?: ChannelSubscriptionResponse;
}

export interface PulseDetailsData {
  pulse: PulseDetailsApiResponse;
  comments: PulseDetailsApiComment[];
  content: LearnContent;
  channel: ChannelDetailsApiResponse | null;
}
