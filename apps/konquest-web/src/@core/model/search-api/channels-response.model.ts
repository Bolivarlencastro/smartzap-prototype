export interface ChannelsResponse {
  id: string;
  name: string;
  creator: string;
  category: string;
  cover_image: string;
  language: string;
  is_active: boolean;
  is_owner: boolean;
  is_contributor: boolean;
  subscription_id: string;
  stats: {
    pulses_count: number;
    subscribers_count: number;
    rating: number;
  };
}
