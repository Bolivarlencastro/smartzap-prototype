import { SectionContentItemTagsDirector } from '../section-content-item-tags.director';
import { SectionContentTagsBuilder } from '../section-content-tags.builder';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { TrailEnrollment } from '@core/model/search-api';
import { MissionModel } from 'app/main/mission/mission.model';

export class CourseSectionContentTagsDirector implements SectionContentItemTagsDirector {
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
    const isContributor = content.isContributor;

    if (canEdit || isContributor) {
      builder.withDevelopmentStatusTag(content.developmentStatus);
    }

    if (this.isEvent(content)) {
      builder.withCourseModelTag(content.missionModel as MissionModel);
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

  private isEvent(content: LearnContentCardData): boolean {
    return content.missionModel === MissionModel.LIVE || content.missionModel === MissionModel.PRESENTIAL;
  }
}
