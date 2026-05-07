import { CardTagType } from '../../../models';

export enum ItemType {
  COURSE = 'rocket_launch',
  EVENT = 'event',
  PULSE = 'target',
  CHANNEL = 'hub',
  TRAIL = 'route',
}

export interface GlobalSearchItem {
  id?: string;
  name?: string;
  duration_time?: number;
  type?: ItemType;
  pulse_type?: any;
  enrolled?: boolean;
  enrollment_status?: string;
  enrollment_required?: boolean;
  is_channel_contributor?: boolean;
  is_channel_owner?: boolean;
  subscription?: string;
  course_model?: string;
  development_status?: string;
  external_course?: GlobalSearchExternalItem;
  tags?: CardTagType[];
}

export interface GlobalSearchExternalItem {
  course_url: string;
}
