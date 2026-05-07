import { Event } from './events';

export interface EventDialogViewModel {
  event: Event;
  loading: boolean;
  data: EventDialogData;
}

export interface EventDialogData {
  enrolled: EventDialogUser[];
  notEnrolled: EventDialogUser[];
}

export interface EventDialogUser {
  id: string;
  name: string;
  avatar: string;
  jobPosition: string;
}
