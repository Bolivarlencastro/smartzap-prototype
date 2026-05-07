export enum ContentTypeTabs {
  ALL = 'ALL',
  TRAILS = 'TRAILS',
  MISSIONS = 'MISSIONS',
  EVENTS = 'EVENTS',
  CHANNELS = 'CHANNELS',
  PULSES = 'PULSES',
  ENROLLMENTS = 'ENROLLMENTS',
}

export interface ContentTypeTab {
  title: string;
  value: ContentTypeTabs;
  enabled?: boolean;
}
