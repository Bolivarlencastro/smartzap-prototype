import { LearnContentListItemActionsBuilder } from '../learn-content-list-item-actions.builder';
import { LearnContentListItemActionsDirector } from '../learn-content-list-item-actions.director';
import { LearnContentListItem } from 'app/main/content-management/models/learn-content-list-item';

export class ChannelItemActionsDirector implements LearnContentListItemActionsDirector {
  constructor(private readonly forceFilteringOnlyManaged: boolean) {}

  construct(builder: LearnContentListItemActionsBuilder, content: LearnContentListItem) {
    builder.reset();

    if (!content) {
      return;
    }
    const isContributor = content.meta['isContributor'] === true;

    builder.withEditAction().withManagePulses();

    if (!this.forceFilteringOnlyManaged) {
      builder.withEditContributorsAction().withTransferAction();
    }

    if (!isContributor) {
      builder.withViewVinculateToGroupAction().withDeleteAction();
    }
  }
}
