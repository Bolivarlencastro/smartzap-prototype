export interface PulseCardDto {
  id: string;
  name: string;
  is_active?: boolean;
  channel_name: string;
  pulse_type: { name: string; id: string };
  cover_image: string;
  bookmark_id?: string;
  stats: { duration: number };
  creator_name?: string;
  created_date?: string;
}
