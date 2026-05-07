import { NgModule } from '@angular/core';
import { CertificateNotificationStrategy } from './notification-route-strategy/certificate-notification-strategy';
import { ChannelNotificationStrategy } from './notification-route-strategy/channel-notification-strategy';
import { DefaultNotificationStrategy } from './notification-route-strategy/default-notification-strategy';
import { LearningTrailNotificationStrategy } from './notification-route-strategy/learning-trail-notification-strategy';
import { MissionEnrollmentNotificationStrategy } from './notification-route-strategy/mission-enrollment-notification-strategy';
import { MissionEvaluationNotificationStrategy } from './notification-route-strategy/mission-evaluation-notification-strategy';
import { MissionNotificationStrategy } from './notification-route-strategy/mission-notification-strategy';
import { PulseNotificationStrategy } from './notification-route-strategy/pulse-notification-strategy';
import { QuizNotificationStrategy } from './notification-route-strategy/quiz-notification-strategy';
import { NotificationService } from './notification.service';
import { MissionExtendDeadlineNotificationStrategy } from './notification-route-strategy/mission-extend-deadline-notification-strategy';
import { IntegrationCourseEvaluationStrategy } from './notification-route-strategy/integration-course-evaluation-strategy.service';

const PROVIDERS = [
  QuizNotificationStrategy,
  ChannelNotificationStrategy,
  CertificateNotificationStrategy,
  LearningTrailNotificationStrategy,
  MissionNotificationStrategy,
  MissionEvaluationNotificationStrategy,
  MissionEnrollmentNotificationStrategy,
  DefaultNotificationStrategy,
  MissionExtendDeadlineNotificationStrategy,
  PulseNotificationStrategy,
  IntegrationCourseEvaluationStrategy,

  // PULSE
  { provide: 'NEW_PULSE_COMMENT', useExisting: PulseNotificationStrategy },

  // PULSE QUIZ
  { provide: 'NEW_QUIZ_ADDED_IN_THE_CHANNEL', useExisting: QuizNotificationStrategy },

  // CHANNEL
  { provide: 'NEW_CHANNEL_COMMENT', useExisting: ChannelNotificationStrategy },
  { provide: 'CHANNEL_TRANSFERRED_TO_YOU', useExisting: ChannelNotificationStrategy },
  { provide: 'NEW_PULSE_ADDED_IN_THE_CHANNEL', useExisting: ChannelNotificationStrategy },
  { provide: 'NEW_CHANNEL_LINKED_IN_THE_GROUP', useExisting: ChannelNotificationStrategy },

  // CERTIFICATE
  { provide: 'NEW_EXTERNAL_ENROLLMENT_CERTIFICATE_TO_REVIEW', useExisting: CertificateNotificationStrategy },
  {
    provide: 'USER_REQUESTED_MISSION_ENROLLMENT_DEADLINE_EXTENSION',
    useExisting: MissionExtendDeadlineNotificationStrategy,
  },

  // LEARNING_TRAIL
  { provide: 'NEW_TRAIL_LINKED_IN_THE_GROUP', useExisting: LearningTrailNotificationStrategy },
  { provide: 'MISSION_TRAIL_ENABLED', useExisting: LearningTrailNotificationStrategy },
  { provide: 'MISSION_TRAIL_DISABLED', useExisting: LearningTrailNotificationStrategy },
  { provide: 'MISSION_TRAIL_DISABLED_FOR_TOO_LONG', useExisting: LearningTrailNotificationStrategy },
  { provide: 'NEW_TRAIL_PUBLISHED', useExisting: LearningTrailNotificationStrategy },
  { provide: 'LEARNING_TRAIL_HAS_EXPIRED', useExisting: LearningTrailNotificationStrategy },
  { provide: 'LEARNING_TRAIL_HAS_BEEN_TRANSFERRED_TO_YOU', useExisting: LearningTrailNotificationStrategy },
  { provide: 'ENROLLED_IN_A_TRAIL', useExisting: LearningTrailNotificationStrategy },
  { provide: 'LEARNING_TRAIL_ENROLLMENT_EXPIRING', useExisting: LearningTrailNotificationStrategy },
  { provide: 'ENROLLED_IN_A_LEARNING_TRAIL', useExisting: LearningTrailNotificationStrategy },

  // MISSION
  { provide: 'NEW_MISSION_LINKED_IN_THE_GROUP', useExisting: MissionNotificationStrategy },
  { provide: 'MISSION_MINIMUM_PERFORMANCE_UPDATED', useExisting: MissionNotificationStrategy },
  { provide: 'MISSION_IN_REVIEW', useExisting: MissionNotificationStrategy },
  { provide: 'MISSION_MODIFIED_BY_CONTRIBUTOR', useExisting: MissionNotificationStrategy },
  { provide: 'MISSION_TRANSFERRED_TO_YOU', useExisting: MissionNotificationStrategy },
  { provide: 'MISSION_HAS_BEEN_DUPLICATED', useExisting: MissionNotificationStrategy },
  { provide: 'MISSION_HAS_BEEN_MOVED', useExisting: MissionNotificationStrategy },
  { provide: 'MISSION_HAS_BEEN_MOVED_TO_YOUR_WORKSPACE', useExisting: MissionNotificationStrategy },
  { provide: 'MISSION_ENROLLMENT_HAS_BEEN_RESTARTED', useExisting: MissionNotificationStrategy },
  { provide: 'REPROVED_ENROLLMENT_HAS_BEEN_MANUALLY_APPROVED', useExisting: MissionNotificationStrategy },
  { provide: 'MISSION_ENROLLMENT_APPROVED', useExisting: MissionNotificationStrategy },
  { provide: 'MISSION_ENROLLMENT_HAS_EXPIRED', useExisting: MissionNotificationStrategy },
  { provide: 'ENROLLED_IN_A_MISSION', useExisting: MissionNotificationStrategy },
  { provide: 'MISSION_ENROLLMENT_DEADLINE_HAS_BEEN_EXTENDED', useExisting: MissionNotificationStrategy },
  { provide: 'MISSION_ENROLLMENT_IS_EXPIRING', useExisting: MissionNotificationStrategy },

  // MISSION EVALUATION
  { provide: 'NEW_MISSION_EVALUATION', useExisting: MissionEvaluationNotificationStrategy },

  // INTEGRATION COURSE EVALUATION
  { provide: 'MIRRORED_COURSE_EVALUATION', useExisting: IntegrationCourseEvaluationStrategy },

  // MISSION/TRAIL ENROLLMENT
  { provide: 'EXTERNAL_ENROLLMENT_REVIEWED', useExisting: MissionEnrollmentNotificationStrategy },
  { provide: 'MISSION_ENROLLMENT_REFUSED', useExisting: MissionEnrollmentNotificationStrategy },

  // DEFAULT
  { provide: 'USER_LINKED_IN_A_NEW_GROUP', useExisting: DefaultNotificationStrategy },
];

@NgModule({
  providers: [...PROVIDERS, NotificationService],
})
export class NotificationModule {}
