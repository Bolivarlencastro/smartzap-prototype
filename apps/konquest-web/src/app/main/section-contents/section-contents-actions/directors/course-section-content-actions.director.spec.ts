import { CourseSectionContentActionsDirector } from './course-section-content-actions.director';
import { SectionContentActionsBuilder } from '../section-content-actions.builder';
import { Chance } from 'chance';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('CourseSectionContentActionsDirector', () => {
  let director: CourseSectionContentActionsDirector;
  let builder: SectionContentActionsBuilder;
  const chance = new Chance();

  beforeEach(() => {
    director = new CourseSectionContentActionsDirector();
    builder = new SectionContentActionsBuilder();
  });

  it('should reset the builder and do nothing if content is provided', () => {
    const resetSpy = jest.spyOn(builder, 'reset');
    director.construct(builder, null);

    const actions = builder.build();

    expect(actions).toEqual([]);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should build the actions for a course for a admin user', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['details', 'share', 'add-bookmark']);
  });

  it('should build the actions for a course for a super admin user', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['details', 'share', 'add-bookmark']);
  });

  it('should build the actions for an course for the content owner', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isOwner: true,
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['details', 'share', 'add-bookmark']);
  });

  it('should include the remove bookmark action when the course is bookmarked', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      bookmarkId: chance.guid(),
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['details', 'share', 'remove-bookmark']);
  });

  it('should build the actions for a published course for a normal user', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      developmentStatus: DevelopmentStatus.DONE,
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['enroll', 'details', 'share', 'add-bookmark']);
  });

  it(`should build the actions for a published course for user with enrollment in the ${EnrollmentStatuses.ENROLLED} status`, () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      developmentStatus: DevelopmentStatus.DONE,
      enrollment: { status: EnrollmentStatuses.ENROLLED },
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['start', 'details', 'share', 'add-bookmark']);
  });

  it(`should build the actions for a published course for user with enrollment in the ${EnrollmentStatuses.STARTED} status`, () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      developmentStatus: DevelopmentStatus.DONE,
      enrollment: { status: EnrollmentStatuses.STARTED },
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['continue', 'details', 'share', 'add-bookmark']);
  });

  it(`should build the actions for a published course for user with enrollment in the ${EnrollmentStatuses.EXPIRED} status`, () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      developmentStatus: DevelopmentStatus.DONE,
      enrollment: { status: EnrollmentStatuses.EXPIRED },
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['request-new-deadline', 'details', 'share', 'add-bookmark']);
  });
});
