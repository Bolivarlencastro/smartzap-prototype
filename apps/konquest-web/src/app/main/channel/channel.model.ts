import { Category } from '@core/model/category.model';
import { User, UserCreator } from '@core/model/user.model';
import { Pulse, PulseType } from '@core/model/pulse.model';

export interface ChannelSubscription {
  id?: string;
  subscription_date?: string;
  unsubscribe_date?: string;
  active_subscription: boolean;
  status?: string;
  created_date?: string;
  updated_date?: string;
  user: string;
  channel: Channel | string;
}

export interface ChannelSubscriptionResponse {
  id?: string;
  created_date?: string;
  updated_date?: string;
  subscription_date?: string;
  unsubscribe_date?: string;
  active_subscription?: boolean;
  status?: string;
  user?: string;
  channel?: string;
}

export interface ChannelSubscriptionsFilters {
  search?: string;
  ordering?: string;
  page?: number;
  per_page?: number;
  user?: string;
  channel__user_creator?: string;
  channel?: string;
  channel_category?: string[];
  active_subscription?: boolean;
}

export class ChannelMini {
  constructor(
    public id?: string,
    public name?: string,
  ) {}
}

export class ChannelStatistics {
  constructor(
    public subscribers?: number,
    public total_subscribers?: number,
    public total_pulses?: number,
    public content_type_distribution?: string,
  ) {}
}

export interface Channel {
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
  channel_type?: ChannelType;
  created_date?: string | Date;
  channel_statistics?: ChannelStatistics;
  user_creator?: UserCreator;
  is_contributor?: boolean;
  is_owner?: boolean;
  language?: string;
  rating_count?: number;
  contributors?: User[];
  subscription?: ChannelSubscriptionResponse;
}

export interface ChannelComment {
  comment: string;
  created_date?: string;
  id?: string;
  channel: string;
  updated_date?: string;
  user: string;
}

export interface ChannelCommentsFilters {
  channel_id?: string;
  search?: string;
  ordering?: string;
  page?: number;
  per_page?: number;
}

/* ******** End Channel Pulse Quiz ******** */

export interface ChannelPulsesFilters {
  channel_id?: string;
  search?: string;
  ordering?: string;
  page?: number;
  per_page?: number;
}

export interface ChannelPulse {
  id: number;
  channel: Channel;
  pulse: Pulse;
  pulseType?: PulseType;
}

export interface ChannelsFilter {
  channel_id?: string;
  search?: string;
  ordering?: string;
  page?: number;
  per_page?: number;
  is_active?: boolean;
  subscribed?: string;
  channel_category?: string | string[];
  language?: string | string[];
  managed?: boolean;
  user_creator?: string;
}

export class ChannelRating {
  constructor(
    public id?: string,
    public channel?: string,
    public user?: string,
    public rating?: number,
    public rating_avg?: number,
  ) {}
}

export class ChannelType {
  constructor(
    public id?: string | number,
    public name?: string,
  ) {}
}

export interface ChannelCategory {
  id?: string;
  name?: string;
  created_date?: string;
  description?: string;
  image?: string;
  updated_date?: string;
}

export class ChannelCardInfo {
  id: string;
  name: string;
  total_pulses: number;
  enrolled: boolean;
  category: string;
  description: string;
  is_active?: boolean;
  language?: string;
  cover_image?: string;
  subscription_id?: string;
  showSubscribeButton?: boolean;
  stats: {
    pulses_count: number;
    subscribers_count: number;
    rating: number;
  };

  constructor(channel: Channel = {} as Channel) {
    this.stats = {
      rating: channel?.rating_avg,
      subscribers_count: channel?.channel_statistics?.total_subscribers,
      pulses_count: channel?.channel_statistics?.total_pulses,
    };
    this.id = channel?.id;
    this.name = channel?.name;
    this.description = channel?.description;
    this.enrolled = channel?.enrolled;
    this.category = channel?.channel_category?.name;
    this.language = channel?.language;
    this.cover_image = channel?.holder_image;
    this.is_active = channel?.is_active;
    this.subscription_id = channel?.subscription?.id;
    this.showSubscribeButton = !channel.is_owner && !channel?.is_contributor;
  }
}
