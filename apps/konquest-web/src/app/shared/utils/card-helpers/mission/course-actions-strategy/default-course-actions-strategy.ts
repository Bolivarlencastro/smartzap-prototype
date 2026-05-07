import { LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';
import { AbstractCourseActionsStrategy } from './course-actions-strategy';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export class DefaultCourseActionsStrategy extends AbstractCourseActionsStrategy {
  override getActions(): LearnContentCardActionId[] {
    const isOwnerOrContributor = this.isOwnerOrContributor();
    const bookmarkAction = this.getBookmarkAction();
    let actions: LearnContentCardActionId[] = ['details', 'share', bookmarkAction];

    if (isOwnerOrContributor) {
      return actions;
    }

    const isPublished = this.isPublished();
    const enrollmentAction = this.getCourseEnrollmentAction();
    if (isPublished && enrollmentAction) {
      actions = [enrollmentAction, ...actions];
    }

    return actions;
  }

  private getCourseEnrollmentAction(): LearnContentCardActionId | undefined {
    const userEnrollment = this.course.stats?.user_enrollment;

    if (!userEnrollment?.status) {
      return 'enroll';
    }

    switch (userEnrollment?.status) {
      case EnrollmentStatuses.ENROLLED:
        return 'start';
      case EnrollmentStatuses.STARTED:
        return 'continue';
      case EnrollmentStatuses.EXPIRED:
        return 'request-new-deadline';
      default:
        return undefined;
    }
  }
}
