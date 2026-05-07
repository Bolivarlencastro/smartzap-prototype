import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SectionContentActionsBuilder } from '../section-content-actions.builder';
import { SectionContentItemActionsDirector } from '../section-content-item-actions.director';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export class CourseSectionContentActionsDirector implements SectionContentItemActionsDirector {
  construct(builder: SectionContentActionsBuilder, content: LearnContentCardData): void {
    builder.reset();

    if (!content) {
      return;
    }

    const courseIsPublished = content.developmentStatus === DevelopmentStatus.DONE;
    if (courseIsPublished) {
      this.setEnrollmentAction(builder, content);
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

  private setEnrollmentAction(builder: SectionContentActionsBuilder, content: LearnContentCardData) {
    if (!content.enrollment?.status) {
      builder.withEnrollAction();
      return;
    }

    switch (content.enrollment.status) {
      case EnrollmentStatuses.ENROLLED:
        builder.withStartAction();
        break;
      case EnrollmentStatuses.STARTED:
        builder.withContinueAction();
        break;
      case EnrollmentStatuses.EXPIRED:
        builder.withRequestNewDeadLineAction();
        break;
    }
  }
}
