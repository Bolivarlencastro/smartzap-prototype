export interface TrailOptions {
  id?: string;
  name: string;
  description: string;
  learning_trail_type?: string;
  trail_type: string;
  language?: string;
  is_active?: boolean;
  holder_image?: string;
  thumb_image?: string;
  user_creator?: string;
  expiration_date?: string;
  type?: string;

  contentInTrail?: string;
  learning_trail?: string;
  mission?: string;
  pulse?: string;
  language_api?: string;
}
