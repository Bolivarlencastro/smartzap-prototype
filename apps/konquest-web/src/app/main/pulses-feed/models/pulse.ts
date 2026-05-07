export interface PulseComment {
  id: string;
  avatar: string;
  name: string;
  user_id?: string;
  comment: string;
  created_at: string;
}

export interface Pulse {
  bookmark_id: string;
  channel_name: string;
  channel_id: string;
  channel_cover_image?: string;
  channel_subscription_id: string;
  is_channel_manager: boolean;
  created_date: string;
  description: string;
  cover_image: string;
  id: string;
  is_active: boolean;
  name: string;
  pulse_type: PulseType;
  duration: number;
  creator_name?: string;
  comments_count: number;
  comments?: PulseComment[];
  average_rating: number;
}

export interface PulseType {
  id: string;
  name: string;
}
