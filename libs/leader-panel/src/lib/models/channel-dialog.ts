import { Channel } from './channel';
import { Pulse } from './pulse';

export interface ChannelDialogViewModel {
  channel: Channel;
  loading: boolean;
  data: ChannelDialogData;
}

export interface ChannelDialogData {
  enrolled: ChannelDialogUser[];
  notEnrolled: ChannelDialogUser[];
  pulses: Pulse[];
}

export interface ChannelDialogUser {
  id: string;
  name: string;
  avatar: string;
  jobPosition: string;
  total_pulse?: number;
  pulse_count?: number;
}
