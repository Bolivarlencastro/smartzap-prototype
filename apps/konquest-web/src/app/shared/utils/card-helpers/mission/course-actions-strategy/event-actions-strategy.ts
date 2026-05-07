import { LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';
import { AbstractCourseActionsStrategy } from './course-actions-strategy';

export class EventsActionsStrategy extends AbstractCourseActionsStrategy {
  override getActions(): LearnContentCardActionId[] {
    const bookmarkAction = this.getBookmarkAction();
    return ['details', 'share', bookmarkAction];
  }
}
