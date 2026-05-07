export interface Report {
  created: string;
  days_left: number;
  file_format: string;
  filters: any;
  id: string;
  language: string;
  object_id: string;
  processing_time: number;
  report_type: ReportType;
  status: string;
  updated: string;
  url: string;
  user_creator: ReportUser;
  user_creator_id: string;
  excess_filters_length?: number;
}

export interface ReportType {
  application: string;
  created: string;
  description: string;
  id: string;
  model: string;
  name: string;
  updated: string;
}

export interface ReportUser {
  email: string;
  id: string;
  name: string;
}
