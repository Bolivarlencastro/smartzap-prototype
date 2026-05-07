export interface PulseManagementItem {
  id: string;
  name: string;
  pulse_type: { id: string; name: string };
  creator_name: string;
  created_date: string;
  is_active: boolean;
}

export interface ChannelPulsesManagementFilter {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ChannelPulsesManagementViewModel {
  channelId: string;
  channelName: string;
  pulsesLoading: boolean;
  pulses: PulseManagementItem[];
  filter: ChannelPulsesManagementFilter;
  totalItems: number;
}
