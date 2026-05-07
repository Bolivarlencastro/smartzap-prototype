import { LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';
import { CoursesResponse } from '@core/model/search-api';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface CourseActionsStrategy {
  getActions(couse: CoursesResponse): LearnContentCardActionId[];
}

export abstract class AbstractCourseActionsStrategy implements CourseActionsStrategy {
  constructor(
    protected course: CoursesResponse,
    protected isSuperAdmin: boolean,
    protected isAdmin: boolean,
  ) {}

  abstract getActions(): LearnContentCardActionId[];

  protected isPublished() {
    return this.course.development_status === DevelopmentStatus.DONE;
  }

  protected isOwnerOrContributor() {
    const isOwner = this.course.stats?.user_is_owner;
    const isContributor = this.course.stats?.user_is_contributor;
    // TODO: The search api doesn't return whether an user is an instructor in a event or not

    return isOwner || isContributor;
  }

  protected getBookmarkAction(): LearnContentCardActionId | undefined {
    const isBookmarked = !!this.course?.stats?.favorite;
    return isBookmarked ? 'remove-bookmark' : 'add-bookmark';
  }
}
