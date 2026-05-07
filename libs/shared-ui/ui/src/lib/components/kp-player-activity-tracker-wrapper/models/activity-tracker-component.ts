export type ActivityTrackerEvent = 'CREATE' | 'UPDATE';

export interface ActivityTrackerComponent {
  clear(): void;

  init(): void;
}
