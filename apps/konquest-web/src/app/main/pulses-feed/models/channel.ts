export interface ChannelPulseSideItem {
  id: string;
  name: string;
  cover_image: string;
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
