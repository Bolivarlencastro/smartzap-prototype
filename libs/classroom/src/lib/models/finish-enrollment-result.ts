import { Enrollment, EnrollmentResume } from '@keeps-platform-frontend-workspace/kp-keeps';

export type FinishEnrollmentResult = {
  resume: EnrollmentResume;
  enrollment: Enrollment;
};
