import { LearnContentListItemDirectorFactory } from './learn-content-list-item-director.factory';
import { CourseItemActionsDirector } from './directors/course-item-actions.director';
import { EventItemActionsDirector } from './directors/event-item-actions.director';
import { TrailItemActionsDirector } from './directors/trail-item-actions.director';

describe('LearnContentListItemDirectorFactory', () => {
  beforeEach(() => {
    (LearnContentListItemDirectorFactory as any).director = undefined;
    (LearnContentListItemDirectorFactory as any).contentType = undefined;
  });

  it('should return a CourseItemActionsDirector for "courses"', () => {
    const director = LearnContentListItemDirectorFactory.getDirector('courses', true);

    expect(director).toBeInstanceOf(CourseItemActionsDirector);
  });

  it('should return a EventItemActionsDirector for "events"', () => {
    const director = LearnContentListItemDirectorFactory.getDirector('events', true);

    expect(director).toBeInstanceOf(EventItemActionsDirector);
  });

  it('should return a TrailItemActionsDirector for "trails"', () => {
    const director = LearnContentListItemDirectorFactory.getDirector('trails', true);

    expect(director).toBeInstanceOf(TrailItemActionsDirector);
  });

  it('should cache the director for the same contentType', () => {
    const first = LearnContentListItemDirectorFactory.getDirector('courses', true);
    const second = LearnContentListItemDirectorFactory.getDirector('courses', true);

    expect(first).toBe(second);
  });

  it('should create a new director if contentType changes', () => {
    const first = LearnContentListItemDirectorFactory.getDirector('courses', true);
    const second = LearnContentListItemDirectorFactory.getDirector('events', true);

    expect(first).not.toBe(second);
  });

  it('should throw an error for unknown contentType', () => {
    expect(() => {
      LearnContentListItemDirectorFactory.getDirector('invalid-type' as any, true);
    }).toThrow('Unknown content type: invalid-type');
  });
});
