import { Chance } from 'chance';
import { SectionContentTagsBuilder } from '../section-content-tags.builder';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TrailSectionContentTagsDirector } from './trail-section-content-tags.director';

describe('TrailSectionContentTagsDirector', () => {
  let director: TrailSectionContentTagsDirector;
  let builder: SectionContentTagsBuilder;
  const chance = new Chance();

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-10-08T00:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    director = new TrailSectionContentTagsDirector();
    builder = new SectionContentTagsBuilder();
  });

  it('should reset the builder and do nothing if content is provided', () => {
    const resetSpy = jest.spyOn(builder, 'reset');
    director.construct(builder, null, false, false);

    const tags = builder.build();

    expect(tags).toEqual([]);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should build the tags for a normal user that is not enrolled', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
    };

    director.construct(builder, content, false, false);
    const tags = builder.build();

    expect(tags).toEqual([]);
  });

  it('should build the tags for a required enrollment content', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      enrollment: { status: EnrollmentStatuses.ENROLLED, required: true },
    };

    director.construct(builder, content, false, false);
    const tags = builder.build();

    expect(tags).toEqual([{ type: 'modifier-required' }, { type: 'enrollment-enrolled' }]);
  });

  it('should build the tags for a temporary content', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      expirationDate: '2025-10-10',
    };

    director.construct(builder, content, false, false);
    const tags = builder.build();

    expect(tags).toEqual([{ type: 'modifier-temporary' }]);
  });

  it('should build the tags for a enrolled content with goal date', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      enrollment: { status: EnrollmentStatuses.ENROLLED, goal_date: '2025-10-10' },
    };

    director.construct(builder, content, false, false);
    const tags = builder.build();

    expect(tags).toEqual([
      { type: 'enrollment-enrolled' },
      {
        type: 'goal-expires-in',
        label: '2 days',
      },
    ]);
  });

  it('should include the published tag when the user is an admin and the content is active', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isActive: true,
    };

    director.construct(builder, content, true, false);
    const tags = builder.build();

    expect(tags).toEqual([{ type: 'development-published' }]);
  });

  it('should include the inactive tag when the user is an admin and the content is inactive', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isActive: false,
    };

    director.construct(builder, content, true, false);
    const tags = builder.build();

    expect(tags).toEqual([{ type: 'development-inactive' }]);
  });

  it('should include the published tag when the user is an super admin or the content owner', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isActive: true,
    };

    director.construct(builder, { ...content, isOwner: true }, false, false);
    expect(builder.build()).toEqual([{ type: 'development-published' }]);

    director.construct(builder, { ...content }, false, true);
    expect(builder.build()).toEqual([{ type: 'development-published' }]);
  });
});
