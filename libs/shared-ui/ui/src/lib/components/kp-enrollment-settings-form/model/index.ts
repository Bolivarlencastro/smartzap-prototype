import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export enum EnrollmentType {
  FREE = 'FREE',
  REQUIRED = 'REQUIRED',
  COMPLIANCE = 'COMPLIANCE',
}

export interface EnrollmentConfig {
  date: string;
  enrollmentType: EnrollmentType;
  cycle?: CycleDto;
}

export interface EnrollmentTypeOptions {
  label: string;
  value: EnrollmentType;
}
