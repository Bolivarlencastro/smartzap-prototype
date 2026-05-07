import { EnrollmentStatuses } from '../../konquest-sdk';

export interface CaixaSmartZapCourseEnrollmentDto {
  id: string;
  course_id: string;
  user_id: string;
  status: EnrollmentStatuses;
  progress: number;
}
