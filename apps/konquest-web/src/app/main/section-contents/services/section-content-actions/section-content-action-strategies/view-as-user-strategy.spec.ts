import { ViewAsUserStrategy } from './view-as-user-strategy';
import { Chance } from 'chance';
import { Router } from '@angular/router';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SECTION_CONTENT_TYPE } from 'app/main/section-contents/models/section-contents-type';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';

describe('ViewAsUserStrategy', () => {
  let strategy: ViewAsUserStrategy;
  const chance = new Chance();
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = { navigate: jest.fn().mockResolvedValue(true) } as unknown as jest.Mocked<Router>;
    strategy = new ViewAsUserStrategy(routerMock);
  });

  it('should navigate to classroom to view the course as a user', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;
    const action = strategy.execute(SECTION_CONTENT_TYPE.COURSES, item);

    action.subscribe((result) => {
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      expect(routerMock.navigate).toHaveBeenCalledWith(['/course', item.contentId]);
      done();
    });
  });

  it('should not navigate when the content can not be viewed as a user', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute(SECTION_CONTENT_TYPE.EVENTS, item);

    action.subscribe((result) => {
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to view EVENTS as a user.');
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    });
  });
});
