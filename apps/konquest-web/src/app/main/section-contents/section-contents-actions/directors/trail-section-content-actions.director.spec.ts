import { TrailSectionContentActionsDirector } from './trail-section-content-actions.director';
import { SectionContentActionsBuilder } from '../section-content-actions.builder';
import { Chance } from 'chance';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';

describe('TrailSectionContentActionsDirector', () => {
  let director: TrailSectionContentActionsDirector;
  let builder: SectionContentActionsBuilder;
  const chance = new Chance();

  beforeEach(() => {
    director = new TrailSectionContentActionsDirector();
    builder = new SectionContentActionsBuilder();
  });

  it('should reset the builder and do nothing if content is provided', () => {
    const resetSpy = jest.spyOn(builder, 'reset');
    director.construct(builder, null);

    const actions = builder.build();
    expect(actions).toEqual([]);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should return the default actions for a normal user', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isOwner: false,
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['details', 'share']);
  });

  it('should return the default actions for a super admin user', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isOwner: false,
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['details', 'share']);
  });

  it('should return the default actions for a admin user', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isOwner: false,
    };

    director.construct(builder, content);
    const actions = builder.build();

    expect(actions).toEqual(['details', 'share']);
  });

  it('should return the default actions for the content owner', () => {
    const content: LearnContentCardData = {
      contentId: chance.guid(),
      backgroundImage: chance.url(),
      title: chance.name(),
      language: 'pt-BR',
      isContributor: false,
      isOwner: true,
    };

    director.construct(builder, content);
    const actions = builder.build();
    expect(actions).toEqual(['details', 'share']);
  });
});
