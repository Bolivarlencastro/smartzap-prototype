import { LearnContentListItemActionsBuilder } from '../learn-content-list-item-actions.builder';
import { LearnContentListItemActionsDirector } from '../learn-content-list-item-actions.director';
import { LearnContentListItem } from 'app/main/content-management/models/learn-content-list-item';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

export class EventItemActionsDirector implements LearnContentListItemActionsDirector {
  constructor(private readonly isContentCreator: boolean) {}

  construct(builder: LearnContentListItemActionsBuilder, content: LearnContentListItem) {
    builder.reset();

    if (!content) {
      return;
    }

    const developmentStatus = content.meta['status'];
    const isFinished = developmentStatus === DevelopmentStatus.CLOSED || developmentStatus === 'FINISHED';
    const enrollable = isFinished || developmentStatus === DevelopmentStatus.DONE;
    const canBeFinished = developmentStatus === DevelopmentStatus.DONE;

    builder.withEditAction();

    if (canBeFinished) {
      builder.withFinishEventAction();
    }
    builder.withManageEnrollments();

    if (enrollable) {
      builder.withEnrollUsersAction();
    }

    if (!this.isContentCreator) {
      builder.withViewVinculateToGroupAction();
    }

    builder.withDeleteAction();
  }
}
