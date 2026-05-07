import { ChannelEffects } from './channel.effects';
import { ExtendDeadlineEffects } from './extend-deadline.effects';
import { LearningTrailEffects } from './learning-trail.effects';
import { MissionEffects } from './mission.effects';
import { NotificationEffects } from './notification.effects';
import { RouterEffects } from './router.effect';
import { UserEffects } from './user.effects';
import { GamificationEffects } from './gamification.effects';
import { LearnContentActionsEffects } from './learn-content-actions.effects';
import { CyclesEffects } from './cycles.effects';
import { VinculateToGroupEffects } from './vinculate-to-group.effects';
import { GlobalSettingsEffects } from './global-settings.effects';
import { CategoriesEffects } from './categories.effects';
import { MessagesEffects } from './messages.effects';
import { EvaluateIntegrationCourseEffects } from './evaluate-integration-course.effects';
import { MissionListingConfigEffects } from './mission-listing-config.effects';
import { ProvidersEffects } from './providers.effects';

export const effects: any[] = [
  RouterEffects,
  UserEffects,
  LearningTrailEffects,
  MissionEffects,
  ChannelEffects,
  NotificationEffects,
  ExtendDeadlineEffects,
  GamificationEffects,
  LearnContentActionsEffects,
  CyclesEffects,
  VinculateToGroupEffects,
  GlobalSettingsEffects,
  CategoriesEffects,
  MessagesEffects,
  EvaluateIntegrationCourseEffects,
  MissionListingConfigEffects,
  ProvidersEffects,
];

export * from './router.effect';
