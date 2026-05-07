export interface KpNotification {
  id: string;
  title: string;
  description?: string;
  created_at: string;
}

export interface KpNotificationSelectEvent {
  notification: KpNotification;
  index: number;
}
