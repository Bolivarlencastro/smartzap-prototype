export enum DataType {
  COURSES = 'courses',
  CHANNELS = 'channels',
  PULSES = 'pulses',
  TRAILS = 'trails',
}

export interface GlobalSearchParams {
  dataType?: DataType;
  enrollmentType?: string;
  duedate?: string;
  duration?: string;
  enrollmentStatus?: string;
  categories?: string[];
  platforms?: string[];
}
