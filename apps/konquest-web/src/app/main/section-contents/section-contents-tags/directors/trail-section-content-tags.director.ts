import { SectionContentItemTagsDirector } from '../section-content-item-tags.director';
import { SectionContentTagsBuilder } from '../section-content-tags.builder';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { TrailEnrollment } from '@core/model/search-api';

export class TrailSectionContentTagsDirector implements SectionContentItemTagsDirector {
  construct(
    builder: SectionContentTagsBuilder,
    content: LearnContentCardData,
    isAdmin: boolean,
    isSuperAdmin: boolean,
  ): void {
    builder.reset();

    if (!content) {
      return;
    }

    const canEdit = isSuperAdmin || isAdmin || content.isOwner;
    if (canEdit) {
      this.setStatusTag(builder, content);
    }

    if (content.enrollment?.required) {
      builder.withRequiredEnrollmentTag();
    }

    if (content.expirationDate) {
      builder.withTemporaryContentTag();
    }

    builder.withEnrollmentStatusTag(content.enrollment?.status);
    builder.withEnrollmentGoalTag(content.enrollment as TrailEnrollment);
  }

  private setStatusTag(builder: SectionContentTagsBuilder, content: LearnContentCardData): void {
    if (content.isActive) {
      builder.withPublishedTag();
      return;
    }

    builder.withInactiveTag();
  }
}
