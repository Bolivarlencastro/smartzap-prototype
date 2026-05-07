import { Pulse } from './pulse';

export interface PulseDialogViewModel {
  pulse: Pulse;
  loading: boolean;
  data: PulseDialogData;
}

export interface PulseDialogData {
  consumedBy: PulseDialogConsumption[];
  notConsumed: PulseDialogConsumption[];
  associatedTrails: PulseDialogLearnContent[];
}

export interface PulseDialogConsumption {
  id: string;
  name: string;
  avatar: string;
  jobPosition: string;
  view_date?: string;
}

export interface PulseDialogLearnContent {
  id: string;
  name: string;
  learn_content_type: 'course' | 'trail' | 'pulse';
}
