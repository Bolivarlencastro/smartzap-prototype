export interface LedEnrollmentActivityModel {
  id: string;
  points: number;
  progress: number;
  performance: number;
  status: string;
  last_access: string;
  contents: LedEnrollmentActivityContentsModel[];
}

export interface LedEnrollmentActivityContentsModel {
  id: string;
  name: string;
  content_type: string;
  first_access: string;
  last_access: string;
  consumption: number;
  duration: number;
  status: string;
}

export interface LedEnrollmentActivityViewModel {
  data: LedEnrollmentActivityModel;
  loading: boolean;
}
