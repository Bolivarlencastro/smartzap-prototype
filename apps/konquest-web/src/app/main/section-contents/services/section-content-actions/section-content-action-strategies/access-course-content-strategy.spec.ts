import { Chance } from 'chance';
import { AccessCourseContentStrategy } from './access-course-content-strategy';
import { Router } from '@angular/router';
import { AluraIntegrationsApi, KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SECTION_CONTENT_TYPE } from 'app/main/section-contents/models/section-contents-type';
import { of, throwError } from 'rxjs';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';
import { marker } from '@jsverse/transloco-keys-manager/marker';

jest.mock('@keeps-platform-frontend-workspace/kp-keeps', () => ({
  ...jest.requireActual('@keeps-platform-frontend-workspace/kp-keeps'),
  KeepsUtils: {
    openUrlInNewTab: jest.fn(),
  },
}));

const mockedKeepsUtils = KeepsUtils as jest.Mocked<typeof KeepsUtils>;

describe('AccessCourseContentStrategy', () => {
  let strategy: AccessCourseContentStrategy;
  const chance = new Chance();
  let routerMock: jest.Mocked<Router>;
  let aluraIntegrationApiMock: jest.Mocked<AluraIntegrationsApi>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<Router>;

    aluraIntegrationApiMock = {
      getAccessUrlByMissionId: jest.fn(),
    } as unknown as jest.Mocked<AluraIntegrationsApi>;

    messageServiceMock = {
      error: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    strategy = new AccessCourseContentStrategy(routerMock, aluraIntegrationApiMock, messageServiceMock);

    jest.clearAllMocks();
  });

  it('should warn and return no-op action if content type is not COURSES', (done) => {
    const item = {} as LearnContentCardData;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const nonCourseType = SECTION_CONTENT_TYPE.EVENTS;

    strategy.execute(nonCourseType, item).subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(`It is not possible to access ${nonCourseType} content.`);
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expect(mockedKeepsUtils.openUrlInNewTab).not.toHaveBeenCalled();
      done();
    });
  });

  it('should navigate to the classroom for an internal course', (done) => {
    const item = { contentId: chance.guid(), externalCourseUrl: null } as LearnContentCardData;

    strategy.execute(SECTION_CONTENT_TYPE.COURSES, item).subscribe((result) => {
      expect(routerMock.navigate).toHaveBeenCalledWith(['/course', item.contentId]);
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      done();
    });
  });

  it('should open an external URL for a non-integration external course', (done) => {
    const item = {
      contentId: chance.guid(),
      externalCourseUrl: chance.url(),
      isIntegration: false,
    } as LearnContentCardData;

    strategy.execute(SECTION_CONTENT_TYPE.COURSES, item).subscribe((result) => {
      expect(mockedKeepsUtils.openUrlInNewTab).toHaveBeenCalledWith(item.externalCourseUrl);
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      done();
    });
  });

  it('should open an integration URL on a successful API call', (done) => {
    const item = {
      contentId: chance.guid(),
      externalCourseUrl: chance.url(),
      isIntegration: true,
    } as LearnContentCardData;
    const accessUrl = { url: chance.url() };
    aluraIntegrationApiMock.getAccessUrlByMissionId.mockReturnValue(of(accessUrl));

    strategy.execute(SECTION_CONTENT_TYPE.COURSES, item).subscribe((result) => {
      expect(aluraIntegrationApiMock.getAccessUrlByMissionId).toHaveBeenCalledWith(item.contentId);
      expect(mockedKeepsUtils.openUrlInNewTab).toHaveBeenCalledWith(accessUrl.url);
      expect(messageServiceMock.error).not.toHaveBeenCalled();
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      done();
    });
  });

  it('should show an error message on a failed API call for an integration course', (done) => {
    const item = {
      contentId: chance.guid(),
      externalCourseUrl: chance.url(),
      isIntegration: true,
    } as LearnContentCardData;
    const error = new Error('API Error');
    aluraIntegrationApiMock.getAccessUrlByMissionId.mockReturnValue(throwError(() => error));

    strategy.execute(SECTION_CONTENT_TYPE.COURSES, item).subscribe((result) => {
      expect(aluraIntegrationApiMock.getAccessUrlByMissionId).toHaveBeenCalledWith(item.contentId);
      expect(messageServiceMock.error).toHaveBeenCalledWith(marker('MISSION.THIS_ACTION_COULD_NOT_BE_PERFORMED'));
      expect(mockedKeepsUtils.openUrlInNewTab).not.toHaveBeenCalled();
      expect(result).toEqual(SectionContentItemActions.executeActionErrorResult({ error }));
      done();
    });
  });
});
