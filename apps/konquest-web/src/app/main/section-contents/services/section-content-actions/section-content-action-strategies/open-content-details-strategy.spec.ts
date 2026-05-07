import { Chance } from 'chance';
import { Router } from '@angular/router';
import { SECTION_CONTENT_TYPE } from '../../../models/section-contents-type';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { navigateToEvent, navigateToMission, navigateToTrail } from 'app/shared/services';
import { SectionContentItemActions } from '../../../store/actions';
import { OpenContentDetailsStrategy } from './open-content-details-strategy';

jest.mock('app/shared/services', () => ({
  navigateToMission: jest.fn(() => Promise.resolve(true)),
  navigateToEvent: jest.fn(() => Promise.resolve(true)),
  navigateToTrail: jest.fn(() => Promise.resolve(true)),
}));

const mockedNavigateToMission = navigateToMission as jest.Mock;
const mockedNavigateToEvent = navigateToEvent as jest.Mock;
const mockedNavigateToTrail = navigateToTrail as jest.Mock;

describe('OpenContentDetailsStrategy', () => {
  let strategy: OpenContentDetailsStrategy;
  const chance = new Chance();
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;
    strategy = new OpenContentDetailsStrategy(routerMock);
    jest.clearAllMocks();
  });

  it('should navigate to mission details when content type is COURSES', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;

    strategy.execute(SECTION_CONTENT_TYPE.COURSES, item).subscribe((result) => {
      expect(mockedNavigateToMission).toHaveBeenCalledWith(routerMock, item.contentId);
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      done();
    });
  });

  it('should navigate to event details when content type is EVENTS', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;

    strategy.execute(SECTION_CONTENT_TYPE.EVENTS, item).subscribe((result) => {
      expect(mockedNavigateToEvent).toHaveBeenCalledWith(routerMock, item.contentId);
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      done();
    });
  });

  it('should navigate to trail details when content type is TRAILS', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;

    strategy.execute(SECTION_CONTENT_TYPE.TRAILS, item).subscribe((result) => {
      expect(mockedNavigateToTrail).toHaveBeenCalledWith(routerMock, item.contentId);
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      done();
    });
  });

  it('should warn and do nothing for unsupported content types', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const unsupportedType = 'UNSUPPORTED_TYPE' as SECTION_CONTENT_TYPE;

    strategy.execute(unsupportedType, item).subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(`It is not possible to open ${unsupportedType} details.`);
      expect(mockedNavigateToMission).not.toHaveBeenCalled();
      expect(mockedNavigateToEvent).not.toHaveBeenCalled();
      expect(mockedNavigateToTrail).not.toHaveBeenCalled();
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      done();
    });
  });
});
