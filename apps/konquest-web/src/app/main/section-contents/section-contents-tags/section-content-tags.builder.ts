import { LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import {
  ENROLLMENT_STATUS_TAG_MAP,
  MISSION_MODEL_TAG_MAP,
  MISSION_STATUS_TAG_MAP,
} from 'app/shared/utils/card-helpers/base/card-maps';
import { CourseEnrollment, TrailEnrollment } from '@core/model/search-api';
import { getEnrollmentGoalTag } from 'app/shared/utils/card-helpers';
import { MissionModel } from 'app/main/mission/mission.model';

export class SectionContentTagsBuilder {
  private tags: LearnContentCardTag[] = [];

  reset() {
    this.tags = [];
  }

  build() {
    return [...this.tags];
  }

  withDevelopmentStatusTag(developmentStatus: DevelopmentStatus) {
    const developmentStatusTag = MISSION_STATUS_TAG_MAP[developmentStatus];

    if (!developmentStatusTag) {
      return this;
    }

    this.tags.push(developmentStatusTag);
    return this;
  }

  withEnrollmentStatusTag(enrollmentStatus: EnrollmentStatuses) {
    const enrollmentStatusTag = ENROLLMENT_STATUS_TAG_MAP[enrollmentStatus];
    if (!enrollmentStatusTag) {
      return this;
    }

    this.tags.push(enrollmentStatusTag);
    return this;
  }

  withEnrollmentGoalTag(enrollment: CourseEnrollment | TrailEnrollment) {
    const enrollmentGoalTag = getEnrollmentGoalTag(enrollment);
    if (!enrollmentGoalTag) {
      return this;
    }

    this.tags.push(enrollmentGoalTag);
    return this;
  }

  withRequiredEnrollmentTag() {
    this.tags.push({ type: 'modifier-required' });
    return this;
  }

  withTemporaryContentTag() {
    this.tags.push({ type: 'modifier-temporary' });
    return this;
  }

  withCourseModelTag(courseModel: MissionModel) {
    const courseModelTag = MISSION_MODEL_TAG_MAP[courseModel];
    if (!courseModelTag) {
      return this;
    }

    this.tags.push(courseModelTag);
    return this;
  }

  withFinishedEventTag() {
    this.tags.push({ type: 'development-finished-event' });
    return this;
  }

  withPublishedTag() {
    this.tags.push({ type: 'development-published' });
    return this;
  }

  withInactiveTag() {
    this.tags.push({ type: 'development-inactive' });
  }
}
