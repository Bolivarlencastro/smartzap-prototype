import { Chance } from 'chance';
import { CourseSectionContentTagsDirector } from './course-section-content-tags.director';
import { SectionContentTagsBuilder } from '../section-content-tags.builder';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MissionModel } from 'app/main/mission/mission.model';

describe('CourseSectionContentTagsDirector', () => {
  let director: CourseSectionContentTagsDirector;
  let builder: SectionContentTagsBuilder;
  const chance = new Chance();

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-10-08T00:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    director = new CourseSectionContentTagsDirector();
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
      developmentStatus: DevelopmentStatus.DONE,
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
      developmentStatus: DevelopmentStatus.DONE,
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
      developmentStatus: DevelopmentStatus.DONE,
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
      developmentStatus: DevelopmentStatus.DONE,
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

  it('should include the development status tag when the user is an admin', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      developmentStatus: DevelopmentStatus.DONE,
    };

    director.construct(builder, content, true, false);
    const tags = builder.build();

    expect(tags).toEqual([{ type: 'development-published' }]);
  });

  it('should include the development status tag when the user is an super admin', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      developmentStatus: DevelopmentStatus.DONE,
    };

    director.construct(builder, content, false, true);
    const tags = builder.build();

    expect(tags).toEqual([{ type: 'development-published' }]);
  });

  it('should include the development status tag when the user is the content owner', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      developmentStatus: DevelopmentStatus.DONE,
      isOwner: true,
    };

    director.construct(builder, content, false, false);
    const tags = builder.build();

    expect(tags).toEqual([{ type: 'development-published' }]);
  });

  it('should include the development status tag when the user one of the content contributors', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      developmentStatus: DevelopmentStatus.DONE,
      isContributor: true,
    };

    director.construct(builder, content, false, false);
    const tags = builder.build();

    expect(tags).toEqual([{ type: 'development-published' }]);
  });

  it('should include the mission model tag if the content is a live event', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      developmentStatus: DevelopmentStatus.DONE,
      missionModel: MissionModel.LIVE,
    };

    director.construct(builder, content, false, false);
    const tags = builder.build();

    expect(tags).toEqual([{ type: 'model-live' }]);
  });

  it('should include the mission model tag if the content is a local event', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      developmentStatus: DevelopmentStatus.DONE,
      missionModel: MissionModel.PRESENTIAL,
    };

    director.construct(builder, content, false, false);
    const tags = builder.build();

    expect(tags).toEqual([{ type: 'model-presential' }]);
  });
});
