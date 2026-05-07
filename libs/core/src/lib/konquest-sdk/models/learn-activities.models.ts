export interface LearnContentActivity {
  readonly id?: string;
  readonly created_date?: Date;
  readonly updated_date?: Date;
  action: AnalyticsEventTypes;
  time_start: Date;
  time_stop?: Date;
  time_in?: number;
  user?: string;
  mission_stage_content?: string;
  pulse?: string;
  speed?: number;
}

export enum AnalyticsEventTypes {
  WATCH = 'WATCH',
  LISTEN = 'LISTEN',
  READ = 'READ',
  VIEW = 'VIEW',
  LEAVE = 'LEAVE',
}
