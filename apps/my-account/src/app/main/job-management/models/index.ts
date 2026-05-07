export interface JobModel {
  id: string;
  name: string;
  created_date?: string;
  updated_date?: string;
  workspace?: string;
}

export interface JobTab {
  title: string;
  value: JobEnum;
}

export interface JobResponse {
  name: string;
}

export enum JobEnum {
  JOB_FUNCTION = 'JOB_FUNCTION',
  JOB_POSITION = 'JOB_POSITION',
}
