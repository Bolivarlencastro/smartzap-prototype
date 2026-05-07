export interface LearnContent {
  readonly id?: string;
  readonly created_date?: Date;
  readonly updated_date?: Date;
  name: string;
  description?: string;
  url?: string;
  link?: string;
  blog?: string;
  analyzed?: boolean;
  category?: string;
  content_type?: { id: string; name: string };
  duration?: number;
  content_transcript?: string;
}
