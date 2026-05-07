import { LearnContentListItemActionsBuilder } from '../learn-content-list-item-actions.builder';
import { LearnContentListItemActionsDirector } from '../learn-content-list-item-actions.director';
import { LearnContentListItem } from '../../models/learn-content-list-item';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

export class CourseItemActionsDirector implements LearnContentListItemActionsDirector {
  constructor(private readonly forceFilteringOnlyManaged: boolean) {}

  construct(builder: LearnContentListItemActionsBuilder, content: LearnContentListItem) {
    builder.reset();

    if (!content) {
      return;
    }

    const isSharedContent = content.meta['shared'] === true;
    const enrollable = content.meta['status'] === DevelopmentStatus.DONE;
    const externalCourse = content.meta['externalCourse'] === true;

    if (!isSharedContent) {
      builder.withEditAction();
    }

    if (!externalCourse) {
      builder.withViewAsUserAction();
    }

    builder.withViewEvaluationsAction();

    if (!isSharedContent && !this.forceFilteringOnlyManaged) {
      builder.withEditContributorsAction().withDuplicateAction().withTransferAction().withShareAction();
    }

    if (enrollable) {
      builder.withEnrollUsersAction();
    }

    builder.withViewStatisticsAction();

    if (!this.forceFilteringOnlyManaged) {
      builder.withViewVinculateToGroupAction();
    }

    if (content.meta?.['status'] === DevelopmentStatus.IN_REVIEW && !isSharedContent) {
      builder.withPublishCourseAction();
    }

    if (!isSharedContent) {
      builder.withDeleteAction();
    }
  }
}
