export type LeaderPanelTab = {
  path: LeaderPanelPageType;
  label: string;
  icon: string;
  serviceId?: string;
};

export type LeaderPanelPageType = 'overview' | 'led' | 'courses' | 'trails' | 'pulses' | 'channels' | 'events';
