import { CourseSectionContentActionsDirector } from './directors/course-section-content-actions.director';
import { EventSectionContentActionsDirector } from './directors/event-section-content-actions.director';
import { TrailSectionContentActionsDirector } from './directors/trail-section-content-actions.director';
import { SectionContentItemActionDirectorFactory } from './section-content-item-action-director.factory';
import { SECTION_CONTENT_TYPE } from 'app/main/section-contents/models/section-contents-type';

describe('SectionContentItemActionDirectorFactory', () => {
  beforeEach(() => {
    (SectionContentItemActionDirectorFactory as any).director = undefined;
    (SectionContentItemActionDirectorFactory as any).contentType = undefined;
  });

  it('should return a CourseSectionContentActionsDirector for "courses"', () => {
    const director = SectionContentItemActionDirectorFactory.getDirector(SECTION_CONTENT_TYPE.COURSES);

    expect(director).toBeInstanceOf(CourseSectionContentActionsDirector);
  });

  it('should return a EventSectionContentActionsDirector for "events"', () => {
    const director = SectionContentItemActionDirectorFactory.getDirector(SECTION_CONTENT_TYPE.EVENTS);

    expect(director).toBeInstanceOf(EventSectionContentActionsDirector);
  });

  it('should return a TrailSectionContentActionsDirector for "trails"', () => {
    const director = SectionContentItemActionDirectorFactory.getDirector(SECTION_CONTENT_TYPE.TRAILS);

    expect(director).toBeInstanceOf(TrailSectionContentActionsDirector);
  });

  it('should cache the director for the same contentType', () => {
    const first = SectionContentItemActionDirectorFactory.getDirector(SECTION_CONTENT_TYPE.COURSES);
    const second = SectionContentItemActionDirectorFactory.getDirector(SECTION_CONTENT_TYPE.COURSES);

    expect(first).toBe(second);
  });

  it('should create a new director if contentType changes', () => {
    const first = SectionContentItemActionDirectorFactory.getDirector(SECTION_CONTENT_TYPE.COURSES);
    const second = SectionContentItemActionDirectorFactory.getDirector(SECTION_CONTENT_TYPE.EVENTS);

    expect(first).not.toBe(second);
  });

  it('should throw an error for unknown contentType', () => {
    expect(() => {
      SectionContentItemActionDirectorFactory.getDirector('invalid-type' as any);
    }).toThrow('Unknown content type: invalid-type');
  });
});
