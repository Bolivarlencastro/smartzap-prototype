import { SECTION_CONTENT_TYPE } from '../models/section-contents-type';
import { TrailSectionContentTagsDirector } from './directors/trail-section-content-tags.director';
import { CourseSectionContentTagsDirector } from './directors/course-section-content-tags.director';
import { SectionContentItemTagDirectorFactory } from './section-content-item-tag-director.factory';

describe('SectionContentItemTagDirectorFactory', () => {
  beforeEach(() => {
    (SectionContentItemTagDirectorFactory as any).director = undefined;
    (SectionContentItemTagDirectorFactory as any).contentType = undefined;
  });

  it('should return a CourseSectionContentTagsDirector for "courses"', () => {
    const director = SectionContentItemTagDirectorFactory.getDirector(SECTION_CONTENT_TYPE.COURSES);

    expect(director).toBeInstanceOf(CourseSectionContentTagsDirector);
  });

  it('should return a TrailSectionContentTagsDirector for "trails"', () => {
    const director = SectionContentItemTagDirectorFactory.getDirector(SECTION_CONTENT_TYPE.TRAILS);

    expect(director).toBeInstanceOf(TrailSectionContentTagsDirector);
  });

  it('should cache the director for the same contentType', () => {
    const first = SectionContentItemTagDirectorFactory.getDirector(SECTION_CONTENT_TYPE.COURSES);
    const second = SectionContentItemTagDirectorFactory.getDirector(SECTION_CONTENT_TYPE.COURSES);

    expect(first).toBe(second);
  });

  it('should create a new director if contentType changes', () => {
    const first = SectionContentItemTagDirectorFactory.getDirector(SECTION_CONTENT_TYPE.COURSES);
    const second = SectionContentItemTagDirectorFactory.getDirector(SECTION_CONTENT_TYPE.EVENTS);

    expect(first).not.toBe(second);
  });

  it('should throw an error for unknown contentType', () => {
    expect(() => {
      SectionContentItemTagDirectorFactory.getDirector('invalid-type' as any);
    }).toThrow('Unknown content type: invalid-type');
  });
});
