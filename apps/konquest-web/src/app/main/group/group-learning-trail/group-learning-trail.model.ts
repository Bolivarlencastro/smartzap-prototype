import { LearningTrail } from 'app/main/learning-trail/model/learning-trail';
import { EnrollmentConfig } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';

export interface GroupLearningTrail {
  id: string;
  learning_trail: LearningTrail;
}

export interface GroupLearningTrailActionData {
  groupId: string;
  learningTrailIds: string[];
  enrollment?: EnrollmentConfig;
}
