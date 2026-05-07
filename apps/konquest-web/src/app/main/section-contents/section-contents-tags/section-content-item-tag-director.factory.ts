import { SECTION_CONTENT_TYPE } from '../models/section-contents-type';
import { SectionContentItemTagsDirector } from './section-content-item-tags.director';
import { TrailSectionContentTagsDirector } from './directors/trail-section-content-tags.director';
import { CourseSectionContentTagsDirector } from './directors/course-section-content-tags.director';

export abstract class SectionContentItemTagDirectorFactory {
  private static director: SectionContentItemTagsDirector;
  private static contentType: SECTION_CONTENT_TYPE;

  static getDirector(contentType: SECTION_CONTENT_TYPE): SectionContentItemTagsDirector {
    if (
      SectionContentItemTagDirectorFactory.contentType === contentType &&
      SectionContentItemTagDirectorFactory.director
    ) {
      return SectionContentItemTagDirectorFactory.director;
    }

    SectionContentItemTagDirectorFactory.contentType = contentType;

    switch (contentType) {
      case SECTION_CONTENT_TYPE.COURSES:
      case SECTION_CONTENT_TYPE.EVENTS:
        SectionContentItemTagDirectorFactory.director = new CourseSectionContentTagsDirector();
        break;
      case SECTION_CONTENT_TYPE.TRAILS:
        SectionContentItemTagDirectorFactory.director = new TrailSectionContentTagsDirector();
        break;
      default:
        throw new Error(`Unknown content type: ${contentType}`);
    }

    return SectionContentItemTagDirectorFactory.director;
  }
}
