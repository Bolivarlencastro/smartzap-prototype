import { LearnContentListItemActionsBuilder } from '../learn-content-list-item-actions.builder';
import { LearnContentListItemActionsDirector } from '../learn-content-list-item-actions.director';
import { LearnContentListItem } from 'app/main/content-management/models/learn-content-list-item';

export class TrailItemActionsDirector implements LearnContentListItemActionsDirector {
  constructor(private readonly isContentCreator: boolean) {}

  construct(builder: LearnContentListItemActionsBuilder, content: LearnContentListItem) {
    builder.reset();

    if (!content) {
      return;
    }

    builder.withEditAction();

    if (!this.isContentCreator) {
      builder.withTransferAction().withViewVinculateToGroupAction();
    }

    const isActive = content.meta['isActive'] === true;
    if (isActive) {
      builder.withEnrollUsersAction();
    }

    builder.withDeleteAction();
  }
}
