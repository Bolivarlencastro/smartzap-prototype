import { EventSectionContentActionsDirector } from './event-section-content-actions.director';
import { SectionContentActionsBuilder } from '../section-content-actions.builder';
import { Chance } from 'chance';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('EventSectionContentActionsDirector', () => {
  let director: EventSectionContentActionsDirector;
  let builder: SectionContentActionsBuilder;
  const chance = new Chance();

  beforeEach(() => {
    director = new EventSectionContentActionsDirector();
    builder = new SectionContentActionsBuilder();
  });

  it('should reset the builder and do nothing if content is provided', () => {
    const resetSpy = jest.spyOn(builder, 'reset');
    director.construct(builder, null);

    const actions = builder.build();

    expect(actions).toEqual([]);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should build the actions for an event for a normal user', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isOwner: false,
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['details', 'share', 'add-bookmark']);
  });

  it('should build the actions for an event for a admin user', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isOwner: false,
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['details', 'share', 'add-bookmark']);
  });

  it('should build the actions for an event for a super admin user', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isOwner: false,
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['details', 'share', 'add-bookmark']);
  });

  it('should build the actions for an event for the content owner', () => {
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

  it('should build the actions for an event that has ended', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isOwner: true,
      developmentStatus: DevelopmentStatus.CLOSED,
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['details', 'share', 'add-bookmark']);
  });

  it('should include the remove bookmark action when the content is bookmarked', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isOwner: false,
      bookmarkId: chance.guid(),
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['details', 'share', 'remove-bookmark']);
  });
});
