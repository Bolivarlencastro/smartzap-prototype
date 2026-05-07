import { SectionContentItemActionsDirector } from './section-content-item-actions.director';
import { SECTION_CONTENT_TYPE } from '../models/section-contents-type';
import { CourseSectionContentActionsDirector } from './directors/course-section-content-actions.director';
import { EventSectionContentActionsDirector } from './directors/event-section-content-actions.director';
import { TrailSectionContentActionsDirector } from './directors/trail-section-content-actions.director';

export abstract class SectionContentItemActionDirectorFactory {
  private static director: SectionContentItemActionsDirector;
  private static contentType: SECTION_CONTENT_TYPE;

  static getDirector(contentType: SECTION_CONTENT_TYPE): SectionContentItemActionsDirector {
    if (
      SectionContentItemActionDirectorFactory.contentType === contentType &&
      SectionContentItemActionDirectorFactory.director
    ) {
      return SectionContentItemActionDirectorFactory.director;
    }

    SectionContentItemActionDirectorFactory.contentType = contentType;

    switch (contentType) {
      case SECTION_CONTENT_TYPE.COURSES:
        SectionContentItemActionDirectorFactory.director = new CourseSectionContentActionsDirector();
        break;
      case SECTION_CONTENT_TYPE.EVENTS:
        SectionContentItemActionDirectorFactory.director = new EventSectionContentActionsDirector();
        break;
      case SECTION_CONTENT_TYPE.TRAILS:
        SectionContentItemActionDirectorFactory.director = new TrailSectionContentActionsDirector();
        break;
      default:
        throw new Error(`Unknown content type: ${contentType}`);
    }

    return SectionContentItemActionDirectorFactory.director;
  }
}
