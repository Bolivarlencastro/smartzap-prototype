export type Pulse = {
  id: string;
  name: string;
  type: string;
  duration: number;
  views: number;
  consumption_rate: number;
  channel_name: string;
  content_type_name?: string;
};
