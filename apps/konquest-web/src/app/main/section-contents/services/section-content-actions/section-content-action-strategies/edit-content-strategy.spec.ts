import { Router } from '@angular/router';
import { Chance } from 'chance';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SECTION_CONTENT_TYPE } from '../../../models/section-contents-type';
import { SectionContentItemActions } from '../../../store/actions';
import { EditContentStrategy } from './edit-content-strategy';

describe('EditContentStrategy', () => {
  let routerMock: jest.Mocked<Router>;
  let strategy: EditContentStrategy;
  const chance = new Chance();

  beforeEach(() => {
    routerMock = { navigate: jest.fn().mockResolvedValue(true) } as unknown as jest.Mocked<Router>;
    strategy = new EditContentStrategy(routerMock);
  });

  it('should navigate to courses edition', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;
    const action = strategy.execute(SECTION_CONTENT_TYPE.COURSES, item);

    action.subscribe((result) => {
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      expect(routerMock.navigate).toHaveBeenCalledWith(['/missions/create', item.contentId]);
      done();
    });
  });

  it('should navigate to events edition', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;
    const action = strategy.execute(SECTION_CONTENT_TYPE.EVENTS, item);

    action.subscribe((result) => {
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      expect(routerMock.navigate).toHaveBeenCalledWith(['/events/create', item.contentId]);
      done();
    });
  });

  it('should navigate to trails edition', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;
    const action = strategy.execute(SECTION_CONTENT_TYPE.TRAILS, item);

    action.subscribe((result) => {
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      expect(routerMock.navigate).toHaveBeenCalledWith(['/learning-trails/create', item.contentId]);
      done();
    });
  });

  it('should not navigate when the content type is invalid', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('invalid-content' as SECTION_CONTENT_TYPE, item);

    action.subscribe((result) => {
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to edit invalid-content.');
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    });
  });
});
