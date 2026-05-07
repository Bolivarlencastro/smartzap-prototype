import { User } from '../../users';

export interface Notification {
  created_date: string;
  deleted?: boolean;
  deleted_date?: string;
  id: string;
  message: string;
  messages: NotificationMessage;
  notification_type: NotificationType;
  object: string;
  read: boolean;
  updated_date: string;
  url: string | null;
  user_receiving: User;
  workspace: string;
}

export interface NotificationMessage {
  title: string;
  description: string;
  title_values: Record<string, unknown>;
}

export interface NotificationType {
  action: string;
  created_date: string;
  deleted_date: string;
  deleted: boolean;
  id: string;
  image: string;
  object_type: string;
  updated_date: string;
}
