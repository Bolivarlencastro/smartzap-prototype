import { LearnContentManagementType } from '../models/learn-content-list-filter';
import { CourseItemActionsDirector } from './directors/course-item-actions.director';
import { EventItemActionsDirector } from './directors/event-item-actions.director';
import { TrailItemActionsDirector } from './directors/trail-item-actions.director';
import { ChannelItemActionsDirector } from './directors/channel-item-actions.director';
import { LearnContentListItemActionsDirector } from './learn-content-list-item-actions.director';

export abstract class LearnContentListItemDirectorFactory {
  private static director: LearnContentListItemActionsDirector;
  private static contentType: LearnContentManagementType;

  static getDirector(
    contentType: LearnContentManagementType,
    forceFilteringOnlyManaged: boolean,
  ): LearnContentListItemActionsDirector {
    if (
      LearnContentListItemDirectorFactory.contentType === contentType &&
      LearnContentListItemDirectorFactory.director
    ) {
      return LearnContentListItemDirectorFactory.director;
    }

    LearnContentListItemDirectorFactory.contentType = contentType;

    switch (contentType) {
      case 'courses':
        LearnContentListItemDirectorFactory.director = new CourseItemActionsDirector(forceFilteringOnlyManaged);
        break;
      case 'events':
        LearnContentListItemDirectorFactory.director = new EventItemActionsDirector(forceFilteringOnlyManaged);
        break;
      case 'trails':
        LearnContentListItemDirectorFactory.director = new TrailItemActionsDirector(forceFilteringOnlyManaged);
        break;
      case 'channels':
        LearnContentListItemDirectorFactory.director = new ChannelItemActionsDirector(forceFilteringOnlyManaged);
        break;
      default:
        throw new Error(`Unknown content type: ${contentType}`);
    }

    return LearnContentListItemDirectorFactory.director;
  }
}
