import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SectionContentActionsBuilder } from '../section-content-actions.builder';
import { SectionContentItemActionsDirector } from '../section-content-item-actions.director';

export class EventSectionContentActionsDirector implements SectionContentItemActionsDirector {
  construct(builder: SectionContentActionsBuilder, content: LearnContentCardData): void {
    builder.reset();

    if (!content) {
      return;
    }

    builder.withDetailsAction().withShareAction();
    this.setBookmarkAction(builder, content);
  }

  private setBookmarkAction(builder: SectionContentActionsBuilder, content: LearnContentCardData) {
    if (content.bookmarkId) {
      builder.withRemoveBookmarkAction();
      return;
    }

    builder.withAddBookmarkAction();
  }
}
